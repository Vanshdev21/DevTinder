# DevTinder

## authRoutes

- POST /signup
- POST /login
- POST /logout

## profileRoute

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRoutes

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/send/accepted/:requestID
- POST /request/send/rejected/:requestID

## userRoutes

- GET user/connections
- GET user/request
- GET user/recived
- GET user/feed
