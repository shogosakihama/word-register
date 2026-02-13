import httpx

words = ['example', 'debated', 'Documentary', 'stream-test-20260212']
client = httpx.Client(timeout=15.0)

for w in words:
    try:
        r = client.post('http://127.0.0.1:8000/api/words', json={'text': w})
        print('CREATE', r.status_code, r.text)
        if r.status_code == 201:
            j = r.json()
            wid = j.get('id')
            f = client.post(f'http://127.0.0.1:8000/api/words/{wid}/fetch')
            print('FETCH', f.status_code, f.text)
    except Exception as e:
        print('ERR', w, e)

try:
    r = client.get('http://127.0.0.1:8000/api/words')
    print('\nALL WORDS:', r.status_code)
    print(r.text)
except Exception as e:
    print('ERR GET ALL', e)

client.close()
