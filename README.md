# Pet Adoption System

## Setup
1. Install dependencies
2. Create `.env` from `.env.example`
3. Run seed: `npm run seed`
4. Start server: `npm start`

## API

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Users
- `GET /api/users/me` (protected)

### Pets
- `GET /api/pets`
- `GET /api/pets/:id`
- `POST /api/pets` (protected)
- `PUT /api/pets/:id` (protected)
- `DELETE /api/pets/:id` (protected)
