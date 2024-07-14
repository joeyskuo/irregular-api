module.exports = {

    removeInactiveSessions: (sessionStore) => {

        const users = Object.keys(sessionStore);
        const currentTime = Date.now();
        const msHour = 1000 * 60 * 60; 

        users.forEach((user) => {
            const userSession = sessionStore[user];
            if(currentTime - userSession.lastActive >= msHour) {
                delete sessionStore[user];
            }
        });
    }
}