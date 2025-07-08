// ServiceNow Scheduled Background Job Script
// Extracts records from sn_dpr_model_release table where planned_start_date = TODAY ONLY
// Ensures only single day records are returned

(function() {
    'use strict';
    
    // Configuration
    var CONFIG = {
        TABLE_NAME: 'sn_dpr_model_release',
        DATE_FIELD: 'planned_start_date',
        LOG_PREFIX: '[Model Release Daily Job]',
        MAX_RECORDS: 1000 // Safety limit
    };
    
    // Main function to get today's planned releases
    function getTodaysModelReleases() {
        try {
            // Get today's date in YYYY-MM-DD format (ServiceNow date format)
            var todayDate = new GlideDate();
            todayDate.setValue(gs.nowDateTime());
            var todayDateString = todayDate.getValue(); // Returns YYYY-MM-DD
            
            gs.info(CONFIG.LOG_PREFIX + ' Processing date: ' + todayDateString);
            
            // Create GlideRecord for the table
            var gr = new GlideRecord(CONFIG.TABLE_NAME);
            
            // Query for EXACT date match (single day only)
            // Using 'ON' operator ensures only records for the specified date
            gr.addQuery(CONFIG.DATE_FIELD, 'ON', todayDateString);
            
            // Optional: Add additional filters for active records
            gr.addQuery('active', true);
            
            // Order by planned_start_date, then by name
            gr.orderBy(CONFIG.DATE_FIELD);
            gr.orderBy('name');
            
            // Set query limit for safety
            gr.setLimit(CONFIG.MAX_RECORDS);
            
            // Execute query
            gr.query();
            
            var results = [];
            var recordCount = 0;
            
            // Process each record
            while (gr.next()) {
                recordCount++;
                
                // Verify the date is exactly today (additional safety check)
                var recordDate = new GlideDate();
                recordDate.setValue(gr.planned_start_date.getValue());
                
                if (recordDate.getValue() === todayDateString) {
                    var record = {
                        sys_id: gr.sys_id.toString(),
                        name: gr.name ? gr.name.toString() : 'N/A',
                        planned_start_date: gr.planned_start_date.toString(),
                        planned_start_date_display: gr.planned_start_date.getDisplayValue(),
                        state: gr.state ? gr.state.toString() : '',
                        state_display: gr.state ? gr.state.getDisplayValue() : 'N/A',
                        model: gr.model ? gr.model.toString() : '',
                        model_display: gr.model ? gr.model.getDisplayValue() : 'N/A',
                        description: gr.description ? gr.description.toString() : '',
                        priority: gr.priority ? gr.priority.toString() : '',
                        priority_display: gr.priority ? gr.priority.getDisplayValue() : 'N/A',
                        assigned_to: gr.assigned_to ? gr.assigned_to.getDisplayValue() : 'N/A',
                        created_on: gr.sys_created_on.toString(),
                        updated_on: gr.sys_updated_on.toString()
                    };
                    
                    results.push(record);
                    
                    // Log each record found
                    gs.info(CONFIG.LOG_PREFIX + ' Found: ' + record.name + ' | Model: ' + record.model_display + ' | State: ' + record.state_display);
                }
            }
            
            // Summary logging
            gs.info(CONFIG.LOG_PREFIX + ' Query completed. Found ' + recordCount + ' records for date: ' + todayDateString);
            
            return {
                success: true,
                date: todayDateString,
                date_display: todayDate.getDisplayValue(),
                count: recordCount,
                records: results,
                timestamp: gs.nowDateTime()
            };
            
        } catch (error) {
            gs.error(CONFIG.LOG_PREFIX + ' Error occurred: ' + error.message);
            gs.error(CONFIG.LOG_PREFIX + ' Stack trace: ' + error.stack);
            
            return {
                success: false,
                error: error.message,
                count: 0,
                records: [],
                timestamp: gs.nowDateTime()
            };
        }
    }
    
    // Function to process today's model releases
    function processModelReleases(releases) {
        if (!releases.success || releases.count === 0) {
            gs.info(CONFIG.LOG_PREFIX + ' No model releases to process for today.');
            return false;
        }
        
        gs.info(CONFIG.LOG_PREFIX + ' Processing ' + releases.count + ' model releases for ' + releases.date_display);
        
        // Process each release
        releases.records.forEach(function(release) {
            try {
                // Example processing actions:
                
                // 1. Send notification
                sendReleaseNotification(release);
                
                // 2. Update release status if needed
                updateReleaseStatus(release);
                
                // 3. Create related tasks or activities
                createRelatedTasks(release);
                
                // 4. Log the processing
                gs.info(CONFIG.LOG_PREFIX + ' Processed release: ' + release.name + ' (ID: ' + release.sys_id + ')');
                
            } catch (processError) {
                gs.error(CONFIG.LOG_PREFIX + ' Error processing release ' + release.name + ': ' + processError.message);
            }
        });
        
        return true;
    }
    
    // Helper function to send notification
    function sendReleaseNotification(release) {
        try {
            // Create event for notification
            gs.eventQueue('model_release.planned_start_today', release, release.sys_id);
            
            // Alternative: Direct email notification
            // var email = new GlideEmailOutbound();
            // email.setTo('release.team@company.com');
            // email.setSubject('Model Release Planned for Today: ' + release.name);
            // email.setBody('Release: ' + release.name + '\nModel: ' + release.model_display + '\nState: ' + release.state_display);
            // email.send();
            
        } catch (notificationError) {
            gs.error(CONFIG.LOG_PREFIX + ' Failed to send notification for release: ' + release.name + ' - ' + notificationError.message);
        }
    }
    
    // Helper function to update release status
    function updateReleaseStatus(release) {
        try {
            // Example: Update state to 'in_progress' if still 'planned'
            if (release.state === 'planned') {
                var updateGr = new GlideRecord(CONFIG.TABLE_NAME);
                if (updateGr.get(release.sys_id)) {
                    updateGr.state = 'in_progress';
                    updateGr.update();
                    gs.info(CONFIG.LOG_PREFIX + ' Updated release ' + release.name + ' state to in_progress');
                }
            }
        } catch (updateError) {
            gs.error(CONFIG.LOG_PREFIX + ' Failed to update release status: ' + release.name + ' - ' + updateError.message);
        }
    }
    
    // Helper function to create related tasks
    function createRelatedTasks(release) {
        try {
            // Example: Create task for release team
            var taskGr = new GlideRecord('task');
            taskGr.initialize();
            taskGr.short_description = 'Process Model Release: ' + release.name;
            taskGr.description = 'Model release planned for today requires processing.\n\nRelease: ' + release.name + '\nModel: ' + release.model_display + '\nState: ' + release.state_display;
            taskGr.priority = release.priority || '3';
            taskGr.assigned_to = release.assigned_to || '';
            taskGr.due_date = gs.nowDateTime();
            taskGr.insert();
            
            gs.info(CONFIG.LOG_PREFIX + ' Created task for release: ' + release.name);
            
        } catch (taskError) {
            gs.error(CONFIG.LOG_PREFIX + ' Failed to create task for release: ' + release.name + ' - ' + taskError.message);
        }
    }
    
    // Function to generate summary report
    function generateSummaryReport(releases) {
        try {
            var summary = {
                date: releases.date_display,
                total_releases: releases.count,
                processed_at: releases.timestamp,
                releases_by_state: {},
                releases_by_priority: {}
            };
            
            // Group by state and priority
            releases.records.forEach(function(release) {
                // Group by state
                if (!summary.releases_by_state[release.state_display]) {
                    summary.releases_by_state[release.state_display] = 0;
                }
                summary.releases_by_state[release.state_display]++;
                
                // Group by priority
                if (!summary.releases_by_priority[release.priority_display]) {
                    summary.releases_by_priority[release.priority_display] = 0;
                }
                summary.releases_by_priority[release.priority_display]++;
            });
            
            // Log summary
            gs.info(CONFIG.LOG_PREFIX + ' === DAILY SUMMARY REPORT ===');
            gs.info(CONFIG.LOG_PREFIX + ' Date: ' + summary.date);
            gs.info(CONFIG.LOG_PREFIX + ' Total Releases: ' + summary.total_releases);
            gs.info(CONFIG.LOG_PREFIX + ' By State: ' + JSON.stringify(summary.releases_by_state));
            gs.info(CONFIG.LOG_PREFIX + ' By Priority: ' + JSON.stringify(summary.releases_by_priority));
            gs.info(CONFIG.LOG_PREFIX + ' Processed At: ' + summary.processed_at);
            
            return summary;
            
        } catch (reportError) {
            gs.error(CONFIG.LOG_PREFIX + ' Error generating summary report: ' + reportError.message);
            return null;
        }
    }
    
    // MAIN EXECUTION - This runs when the scheduled job executes
    function main() {
        gs.info(CONFIG.LOG_PREFIX + ' === SCHEDULED JOB STARTED ===');
        gs.info(CONFIG.LOG_PREFIX + ' Timestamp: ' + gs.nowDateTime());
        
        try {
            // Step 1: Get today's model releases
            var todaysReleases = getTodaysModelReleases();
            
            if (!todaysReleases.success) {
                gs.error(CONFIG.LOG_PREFIX + ' Failed to retrieve today\'s releases: ' + todaysReleases.error);
                return false;
            }
            
            // Step 2: Process the releases
            var processResult = processModelReleases(todaysReleases);
            
            // Step 3: Generate summary report
            var summary = generateSummaryReport(todaysReleases);
            
            // Step 4: Final logging
            gs.info(CONFIG.LOG_PREFIX + ' === SCHEDULED JOB COMPLETED ===');
            gs.info(CONFIG.LOG_PREFIX + ' Success: ' + processResult);
            gs.info(CONFIG.LOG_PREFIX + ' Records processed: ' + todaysReleases.count);
            gs.info(CONFIG.LOG_PREFIX + ' Date: ' + todaysReleases.date_display);
            
            return true;
            
        } catch (mainError) {
            gs.error(CONFIG.LOG_PREFIX + ' Critical error in main execution: ' + mainError.message);
            return false;
        }
    }
    
    // Execute main function
    main();
    
})();