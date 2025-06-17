
"use client";

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebaseConfig'; // db can be undefined
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp, Timestamp, where, writeBatch, getDoc } from 'firebase/firestore';
import type { Equipment } from '@/types';
import { useToast } from './use-toast';

export interface EquipmentFilters {
  category?: string;
  status?: Equipment['status'];
  warrantyExpiryDateBefore?: Date;
}

export function useEquipment() {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true); // Default to true
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const [isDbAvailable, setIsDbAvailable] = useState(false);

  useEffect(() => {
    if (db) {
      setIsDbAvailable(true);
      // setLoading(true) will be handled by fetchEquipment if/when it runs
    } else {
      setIsDbAvailable(false);
      setLoading(false); // Set loading to false definitively if no db
      setEquipmentList([]); // Set list to empty definitively if no db
    }
  }, []); // Empty dependency array: runs once on mount

  const ensureDbAvailable = useCallback(() => {
    if (!isDbAvailable || !db) { // Check both for robustness
      toast({ title: "Service Unavailable", description: "Database not configured. This feature is currently unavailable.", variant: "destructive" });
      return false;
    }
    return true;
  }, [isDbAvailable, db, toast]);

  const fetchEquipment = useCallback((filters?: EquipmentFilters) => {
    if (!isDbAvailable || !db) {
      setLoading(false);
      setEquipmentList([]);
      return () => {}; // Return a no-op unsubscribe function
    }

    setLoading(true);
    const equipmentCollectionRef = collection(db, 'equipment');
    let q = query(equipmentCollectionRef, orderBy('createdAt', 'desc'));

    if (filters) {
      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters.warrantyExpiryDateBefore) {
        q = query(q, where('warrantyExpiryDate', '<=', Timestamp.fromDate(filters.warrantyExpiryDateBefore)));
      }
    }
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Equipment));
      setEquipmentList(data);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching equipment:", err);
      setError(err);
      setLoading(false);
      toast({ title: "Error", description: "Could not fetch equipment data.", variant: "destructive" });
    });

    return unsubscribe;
  }, [isDbAvailable, db, toast]);

  useEffect(() => {
    if (isDbAvailable && db) { // Ensure db is also checked here for clarity
      const unsubscribe = fetchEquipment(); // Call without arguments for the main list
      return () => unsubscribe();
    }
    // If !isDbAvailable, the first useEffect has already set loading and equipmentList.
    // No further state updates are needed in an else block here.
  }, [isDbAvailable, db, fetchEquipment]); // Added db as a dependency


  const addEquipment = async (equipmentData: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!ensureDbAvailable() || !db) return null;
    try {
      const equipmentCollectionRef = collection(db, 'equipment');
      const docRef = await addDoc(equipmentCollectionRef, {
        ...equipmentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast({ title: "Success", description: "Equipment added successfully." });
      return docRef.id;
    } catch (e: any) {
      console.error("Error adding equipment: ", e);
      toast({ title: "Error", description: e.message || "Could not add equipment.", variant: "destructive" });
      setError(e);
      return null;
    }
  };

  const updateEquipment = async (id: string, updates: Partial<Omit<Equipment, 'id' | 'createdAt'>>) => {
    if (!ensureDbAvailable() || !db) return;
    const equipmentDocRef = doc(db, 'equipment', id);
    try {
      await updateDoc(equipmentDocRef, { ...updates, updatedAt: serverTimestamp() });
      toast({ title: "Success", description: "Equipment updated successfully." });
    } catch (e: any) {
      console.error("Error updating equipment: ", e);
      toast({ title: "Error", description: e.message || "Could not update equipment.", variant: "destructive" });
      setError(e);
    }
  };

  const deleteEquipment = async (id: string) => {
    if (!ensureDbAvailable() || !db) return;
    const equipmentDocRef = doc(db, 'equipment', id);
    try {
      await deleteDoc(equipmentDocRef);
      toast({ title: "Success", description: "Equipment deleted successfully." });
    } catch (e: any) {
      console.error("Error deleting equipment: ", e);
      toast({ title: "Error", description: e.message || "Could not delete equipment.", variant: "destructive" });
      setError(e);
    }
  };
  
  const getEquipmentById = useCallback(async (id: string): Promise<Equipment | null> => {
    if (!ensureDbAvailable() || !db) return null;
    try {
      const docRef = doc(db, "equipment", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Equipment;
      } else {
        toast({ title: "Not Found", description: "Equipment item not found.", variant: "destructive" });
        return null;
      }
    } catch (err: any) {
      console.error("Error fetching equipment by ID:", err);
      toast({ title: "Error", description: "Could not fetch equipment details.", variant: "destructive" });
      return null;
    }
  }, [ensureDbAvailable, db, toast]);

  const batchUpdateEquipment = async (ids: string[], updates: Partial<Omit<Equipment, 'id' | 'createdAt'>>) => {
    if (!ensureDbAvailable() || !db) return;
    const batch = writeBatch(db);
    ids.forEach(id => {
      const docRef = doc(db, 'equipment', id);
      batch.update(docRef, { ...updates, updatedAt: serverTimestamp() });
    });
    try {
      await batch.commit();
      toast({ title: "Success", description: `${ids.length} equipment items updated.` });
    } catch (e: any) {
      console.error("Error batch updating equipment: ", e);
      toast({ title: "Error", description: e.message || "Could not perform batch update.", variant: "destructive" });
      setError(e);
    }
  };

  const exportEquipmentToCSV = useCallback(() => {
    if (!ensureDbAvailable()) { 
        return;
    }
    if (equipmentList.length === 0) {
      toast({ title: "No Data", description: "There is no equipment data to export.", variant: "default" });
      return;
    }

    const headers = [
      "ID", "Name", "Category", "Status", "Serial Number", 
      "Purchase Date", "Warranty Expiry", "Assigned To", "Location", 
      "Notes", "Tracking Number", "Tracking Status", "Image URL",
      "Created At", "Updated At"
    ];
    
    const formatTimestamp = (ts: Timestamp | null | undefined) => { 
        if (!ts) return "";
        return typeof ts.toDate === 'function' ? ts.toDate().toLocaleDateString() : "Invalid Date";
    };

    const rows = equipmentList.map(eq => [
      eq.id,
      eq.name,
      eq.category,
      eq.status,
      eq.serialNumber,
      formatTimestamp(eq.purchaseDate),
      formatTimestamp(eq.warrantyExpiryDate),
      eq.assignedTo || "",
      eq.location || "",
      eq.notes || "",
      eq.trackingNumber || "",
      eq.trackingStatus || "",
      eq.imageUrl || "",
      formatTimestamp(eq.createdAt), 
      formatTimestamp(eq.updatedAt)
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','));

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + "\n" 
      + rows.join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "equipment_data.csv");
    document.body.appendChild(link); 
    link.click();
    document.body.removeChild(link);
    toast({ title: "Success", description: "Equipment data exported to CSV." });
  }, [ensureDbAvailable, equipmentList, toast]); // equipmentList is a dependency here


  return { equipmentList, loading, error, addEquipment, updateEquipment, deleteEquipment, getEquipmentById, fetchEquipment, batchUpdateEquipment, exportEquipmentToCSV };
}
