import React, { createContext } from 'react';
import { StitchClientFactory } from 'mongodb-stitch';

export default async function initializeAppClient(appId) {
  // Create a Stitch client object
  const stitchClient = await StitchClientFactory.create(appId);
  // Instantiate the MongoDB Service
  const mongodb = stitchClient.service("mongodb", "mongodb-atlas");
  // Stub out an object for the current user's profile information
  const currentUser = { isAuthenticated: false, profile: {} };

  return { stitchClient, mongodb, currentUser };
}

const StitchContext = createContext(null);
export { StitchContext };
