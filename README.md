# guestbook

A simple guestbook frontend

## `API_URL` expectations

### `GET` /

Returns a list of guestbook entries in JSON format:

```jsonc
[
	{
		"name": "John Doe",
		"message": "Hello, world!",
		"timestamp": "2024-01-01T12:00:00Z",
		"reply": "hi"
	}
	// ...
]
```

### `POST` /

Accepts a form submission with `name`, `message`, `email` fields.

Responds with plain text "OK" if successful. Otherwise a plain text error message is returned.

## Developing

Start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```
