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
