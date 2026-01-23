import requests

url = "https://yourinstance.service-now.com/oauth_token.do"

payload = {
    'grant_type': 'client_credentials',
    'client_id': 'YOUR_CLIENT_ID',
    'client_secret': 'YOUR_CLIENT_SECRET'
}

response = requests.post(url, data=payload)
token_data = response.json()

print(f"Access Token: {token_data.get('access_token')}")


import requests

# Configuration
instance_url = "https://yourinstance.service-now.com"
table_name = "incident"
access_token = "YOUR_ACCESS_TOKEN"

# Endpoint and Headers
endpoint = f"{instance_url}/api/now/table/{table_name}"
params = {
    'sysparm_limit': 10,
    'sysparm_query': 'active=true'
}

# Using 'with' statement for session management
with requests.Session() as session:
    # Set the persistent Authorization header for this session
    session.headers.update({
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json",
        "Content-Type": "application/json"
    })

    try:
        # Make the request using the session object
        response = session.get(endpoint, params=params)
        
        # Raise an error for bad status codes (4xx or 5xx)
        response.raise_for_status()
        
        data = response.json()
        print(f"Successfully retrieved {len(data['result'])} records.")
        
        # Example: Accessing first record
        if data['result']:
            print(f"First Incident Number: {data['result'][0]['number']}")

    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

