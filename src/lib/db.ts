import Dexie, { Table } from "dexie";
import { IProposal } from "@/models/Proposal";

// We add an optional _id field for Dexie's typings
export interface IOfflineProposal extends IProposal {
  _id?: string;
}

export class SanshodhanamDB extends Dexie {
  proposals!: Table<IOfflineProposal>;

  constructor() {
    super("sanshodhanamDB");
    this.version(1).stores({
      // The '++_id' indicates an auto-incrementing primary key if not provided.
      // We will use the MongoDB ObjectId as the key.
      proposals: "&_id, status, projectTitle, updatedAt",
    });
  }
}

export const db = new SanshodhanamDB();

/**
 * Clears all proposal data from the IndexedDB.
 * This function is critical and will be called on user logout.
 */
export async function clearOfflineData() {
  try {
    await db.proposals.clear();
    console.log("Offline proposal data cleared successfully.");
  } catch (error) {
    console.error("Failed to clear offline data:", error);
  }
}
