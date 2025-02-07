import axios from 'axios';
import superagent from 'superagent';

const API_URL = 'https://m-esakafo-1.onrender.com';

// Configuration axios
const api = axios.create({
    baseURL: API_URL,
    timeout: 10000, // Délai d'attente de 10 secondes
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
    console.log('Réponse reçue :', response);
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
        
        if (typeof response.data === 'string') {
            const startIndex = response.data.lastIndexOf('[{');
            const endIndex = response.data.lastIndexOf('}]') + 2;
            
            if (startIndex !== -1 && endIndex !== -1) {
                const jsonStr = response.data.substring(startIndex, endIndex);
                try {
                    const plats = JSON.parse(jsonStr);
                    if (Array.isArray(plats)) {
                        console.log(`${plats.length} plats récupérés correctement`);
                        return plats;
                    }
                } catch (parseError) {
                    console.error('Erreur parsing JSON:', parseError);
                }
            }
        } else if (Array.isArray(response.data)) {
            console.log(`${response.data.length} plats récupérés`);
            return response.data;
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

            console.log('Envoi de la commande:', commandeData);

            return api.post('/api/commandes', commandeData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
        });

        const results = await Promise.all(promises);
        console.log('Réponses reçues:', results);

        // Vérifier si toutes les commandes ont réussi
        const failedCommands = results.filter(r => !r.data.success);
        if (failedCommands.length > 0) {
            throw new Error('Certaines commandes ont échoué: ' + 
                failedCommands.map(r => r.data.error).join(', '));
        }

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