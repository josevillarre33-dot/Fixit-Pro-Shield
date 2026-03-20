import { db } from '../config/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';

export const getOrders = async (userId) => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const orders = [];
    querySnapshot.forEach((docSnapshot) => {
      orders.push({
        id: docSnapshot.id,
        ...docSnapshot.data()
      });
    });
    return orders;
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    throw error;
  }
};

export const cancelOrder = async (orderId, technicianAccepted) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const updateData = {
      status: 'cancelado',
      canceledAt: serverTimestamp(),
      cancelationFeeApplied: technicianAccepted || false
    };
    if (technicianAccepted) {
      updateData.cancelationFee = 10;
    }
    await updateDoc(orderRef, updateData);
    return true;
  } catch (error) {
    console.error('Error cancelando pedido:', error);
    throw new Error('No se pudo cancelar el pedido');
  }
};

export const getOrderById = async (orderId) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    if (orderSnap.exists()) {
      return { id: orderSnap.id, ...orderSnap.data() };
    } else {
      throw new Error('Orden no encontrada');
    }
  } catch (error) {
    console.error('Error obteniendo orden:', error);
    throw error;
  }
};