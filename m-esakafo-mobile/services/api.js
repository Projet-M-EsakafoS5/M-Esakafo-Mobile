import axios from 'axios';

const API_URL = 'https://m-esakafo-1.onrender.com'

// Configuration axios
const api = axios.create({
    baseURL: API_URL,
    timeout: 10000, 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

api.interceptors.request.use(request => {
    return request;
}, error => {
    console.error('Erreur de requête :', error);
    return Promise.reject(error);
});

api.interceptors.response.use(response => {
    // console.log('Réponse reçue :', response);
    return response;
}, error => {
    console.error('Erreur de réponse :', error.response ? error.response.data : error.message);
    return Promise.reject(error);
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fonction pour réessayer une requête
const retryRequest = async (fn, retries = 3, interval = 5000) => {
    try {
        return await fn();
    } catch (error) {
        if (retries === 0) throw error;
        
        console.log(`Nouvelle tentative dans ${interval / 1000} secondes...`);
        await delay(interval);
        return retryRequest(fn, retries - 1, interval);
    }
};

// Récupération des plats au /api/plats
export const fetchPlats = async () => {
    try {
        console.log('Fetching plats...');
        const response = await api.get('/api/plats');
        
        // Vérifiez si la réponse contient des données sous la clé "data"
        if (response.data && Array.isArray(response.data.data)) {
            console.log(`${response.data.data.length} plats récupérés`);
            return response.data.data;
        }

        console.error('Format de réponse invalide:', response.data);
        return [];
    } catch (error) {
        console.error('Erreur lors de la récupération des plats:', error);
        return [];
    }
};

export const createCommande = async (userId, plats, numeroTicket, quantite) => { 
    try {
        // Validation des paramètres
        if (!userId) {
            throw new Error('UserId est requis');
        }
        if (!Array.isArray(plats) || plats.length === 0) {
            throw new Error('La liste des plats est requise et ne peut pas être vide');
        }
        if (typeof quantite !== 'number' || quantite <= 0) {
            throw new Error('La quantité est invalide');
        }

        console.log('Création commande avec ticket:', numeroTicket, 'plats:', plats);

        const promises = plats.map(plat => {
            if (!plat || !plat.id) {
                throw new Error('Format de plat invalide. Chaque plat doit avoir un id');
            }

            const commandeData = {
                userId: userId,
                platId: plat.id,
                quantite: quantite,
                numeroTicket: numeroTicket
            };

            console.log('Envoi de la commande au serveur:', commandeData);

            return api.post('/api/commandes/create', commandeData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
        });

        const results = await Promise.all(promises);

        return {
            success: true,
            commandes: results.map(r => r.data.data)
        };
    } catch (error) {
        console.error('Erreur détaillée:', error);
        if (error.response) {
            console.error('Réponse d\'erreur:', error.response.data);
        }
        throw new Error(
            error.response?.data?.error || 
            error.response?.data?.message || 
            error.message || 
            'Erreur lors de la création de la commande'
        );
    }
};
export const fetchCommandesTerminees = async (userId) => {
    try {
        if (!userId) {
            throw new Error("UserId est requis");
        }

        console.log(`Récupération des commandes terminées pour l'utilisateur ID: ${userId}`);
        const response = await api.get(`/api/commandes/check-user-orders/${userId}`);

        if (response.data && Array.isArray(response.data)) {
            console.log(`${response.data.length} commandes terminées récupérées`);
            return response.data;
        }

        console.error('Format de réponse invalide:', response.data);
        return [];
    } catch (error) {
        console.error("Erreur lors de la récupération des commandes terminées:", error);
        return [];
    }
};