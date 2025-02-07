import { passwordConfig as SQLAuthentication } from '../db/config.js';
import { createDatabaseConnection } from '../db/database.js';

// This is an example for an API endpoint that serves sensitive information for an authenticated user's session
import { verifyTideCloakToken } from '/lib/tideJWT';

// This endpoint is validating that only a specific role will be authorised to access the data
const AllowedRole = 'offline_access';

//Connect to SQL server and create the users and notes tables if not existing
const database = await createDatabaseConnection(SQLAuthentication);

export default async function handler(req, res) {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const user = await verifyTideCloakToken(token, AllowedRole);

    if (!user) {
      return res.status(403).json({ error: 'Forbidden: Invalid token or role' });
    }
    else {
      const noteId = JSON.parse(req.body);
      const rowsAffected = await database.deleteNote(noteId);
      res.status(204).json({rowsAffected});
    }

  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
