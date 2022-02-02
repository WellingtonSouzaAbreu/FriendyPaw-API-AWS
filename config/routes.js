module.exports = app => {

    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.user.signin)
    app.post('/validate-token', app.api.user.validateToken)

    app.route('/adoption')
        // .all(app.config.passport.authenticate())
        .get(app.api.adoption.getAdoptions)
        .post(app.api.adoption.save)

    app.delete('/adoption/:id', app.api.adoption.removeAdoption)

    app.route('/adoption/already-adopted-and-express-interest/:animalId')
        .all(app.config.passport.authenticate())
        .get(app.api.adoption.alreadyAdoptedAndExpressInterest)

    app.route('/adoption/animal-select')
        .all(app.config.passport.authenticate())
        .get(app.api.adoption.getAnimalsByUserAdoption)

    app.route('/adoption/number-by-user')
        .all(app.config.passport.authenticate())
        .get(app.api.adoption.getNumberOfAdoptionsByUser)

    app.route('/animal')
        .get(app.api.animal.getAnimals)
        .post(app.api.animal.save)

    app.get('/animal/available-for-adoption', app.api.animal.getAnimalsAvailableForAdoption)

    app.get('/animal/select-options', app.api.animal.getAnimalSelectOptions)

    app.route('/animal/:id')
        .get(app.api.animal.getAnimalById)
        .delete(app.api.animal.removeAnimal)

    app.route('/animal/:id/all-data')
        .get(app.api.animal.getAllDataOfAnimalById)

    app.post('/animal/picture', app.api.animal.savePicture)

    app.route('/collaborator')
        .get(app.api.collaborator.getCollaborators)
        .post(app.api.collaborator.save)
        .put(app.api.collaborator.save)

    app.route('/collaborator/:id')
        .delete(app.api.collaborator.removeCollaborator)

    app.get('/collaborator/select-options', app.api.collaborator.getCollaboratorSelectOptions)

    app.route('/complaint')
        .get(app.api.complaint.getComplaints)
        .post(app.api.complaint.save)

    app.route('/complaint/change-state/:id/:state')
        .put(app.api.complaint.changeStateOfComplaint)

    app.route('/complaint/:id')
        .delete(app.api.complaint.removeComplaint)

    app.route('/donation')
        .all(app.config.passport.authenticate())
        .get(app.api.donation.getDonations)
        .post(app.api.donation.save)

    app.route('/donation/change-state/:id/:state')
        .put(app.api.donation.changeStateOfDonation)

    app.route('/donation/:id')
        .delete(app.api.donation.removeDonation)

    app.route('/donation/number-of-donations-received')
        .get(app.api.donation.numberOfDonationsReceived)

    app.route('/interesteds-in-adoption')
        .get(app.api.interestedInAdoption.getInterestedsInAdoption)

    app.route('/interesteds-in-adoption/:animalId')
        .all(app.config.passport.authenticate())
        .post(app.api.interestedInAdoption.save)

    app.delete('/interesteds-in-adoption/interest/:id', app.api.interestedInAdoption.removeInterested)

    app.put('/interesteds-in-adoption/toggle-state', app.api.interestedInAdoption.toggleVerifiedState)

    app.post('/interested-in-adoption/picture', app.api.interestedInAdoption.savePicture)

    app.route('/publication')
        .get(app.api.publication.getPublications)
        .post(app.api.publication.save)

    app.route('/publication/summarized')
        .get(app.api.publication.getPublicationsSummarized)

    app.get('/publication/event', app.api.publication.getEvents)

    app.get('/publication/done', app.api.publication.getDones)

    app.route('/publication/:id')
        .get(app.api.publication.getPublicationById)
        .delete(app.api.publication.removePublication)

    app.post('/publication/picture', app.api.publication.savePicture)

    app.post('/remote-monitoring', app.api.remoteMonitoring.save)

    app.delete('/remote-monitoring/:id', app.api.remoteMonitoring.removeRemoteMonitoring)

    app.get('/remote-monitoring/:idAdoption', app.api.remoteMonitoring.getRemoteMonitoringsByAdoption)

    app.post('/remote-monitoring/picture', app.api.remoteMonitoring.savePicture)

    app.route('/rescue/:animalId')
        .get(app.api.rescue.getRescue)
        .put(app.api.rescue.update)

    app.delete('/temporary-home/:id', app.api.temporaryHome.removeTemporaryHome)

    app.route('/temporary-home')
        .get(app.api.temporaryHome.getTemporaryHomes)
        .post(app.api.temporaryHome.save)

    app.get('/user/select-options', app.api.user.getUserSelectOptions)

    app.route('/user/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.user.getUserById)
        .put(app.api.user.save)

    app.post('/veterinary-care', app.api.veterinaryCare.save)
    app.delete('/veterinary-care/:id', app.api.veterinaryCare.removeVeterinaryCare)

    app.post('/visit', app.api.visit.save)

    app.delete('/visit/:id', app.api.visit.removeVisit)

    app.get('/visit/:idAdoption', app.api.visit.getVisitsByAdoption)

    app.post('/generate-recovery-password', app.api.recoveryPassword.generateStaticPage)

    app.put('/recovery-password', app.api.recoveryPassword.saveNewPassword)

    app.get('/already-changed', app.api.recoveryPassword.endpointAlreadyUsed)
}