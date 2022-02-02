const path = require('path')

module.exports = app => {

    const save = async (req, res) => {
        console.log(req.body)
        const { existsOrError, objectIsNull } = app.api.validation

        const veterinaryCare = await objectIsNull(req.body.veterinaryCare) ? res.status(400).send('Dados do cuidado veterinário não informados') : req.body.veterinaryCare

        // const costsVeterinaries = [...veterinaryCare.costsVeterinaries] // Obsoleto
        // delete veterinaryCare.costsVeterinaries // Obsoleto
        // veterinaryCare.totalCostOfTreatment = getTotalCostOfTreatment(costsVeterinaries)

        try {
            existsOrError(veterinaryCare.veterinaryName, 'Nome do veterinário não informado!')
            existsOrError(veterinaryCare.totalCostOfTreatment, 'Custo total do tratamento não informado!')
            existsOrError(veterinaryCare.dateOfVeterinaryCare, 'Data não informada!')
            if (!Number.isInteger(parseFloat(veterinaryCare.totalCostOfTreatment))) throw 'Informe um valor numérico nos custos veterinários!'

        } catch (err) {
            console.log(err)
            app.api.bugReport.writeInBugReport(err, path.basename(__filename))
            return res.status(400).send(err)
        }

        veterinaryCare.dateOfVeterinaryCare = veterinaryCare.dateOfVeterinaryCare.split('Z')[0]

        if (veterinaryCare.id) {
            await app.db('veterinary-cares')
                .update(veterinaryCare)
                .where({ id: veterinaryCare.id })
                .then(_ => res.status(200).send())
                .catch(err => {
                    console.log(err)
                    app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    res.status(500).send('Ocorreu um erro ao atualizar cuidado veterinário!')
                })
        } else {
            await app.db('veterinary-cares')
                .insert(veterinaryCare)
                .then(_ => res.status(200).send())
                .catch(err => {
                    console.log(err)
                    app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    res.status(500).send('Ocorreu um erro ao cadastrar cuidado veterinário!')
                })
        }

        // Obsoleto
        /* costsVeterinaries.map(cost => cost.veterinaryCareId = idVeterinaryCare)

        await app.db('costs-veterinaries')
            .insert(costsVeterinaries)
            .then(_ => res.status(204).send())
            .catch(err => {
                console.log(err)
                app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                res.status(500).send('Erro ao cadastrar gastos veterinários')
            }) */
    }

    /* const getTotalCostOfTreatment = (costsVeterinaries) => {
        let totalCost = 0
        costsVeterinaries.map(cost => totalCost += cost.value)
        return totalCost
    } */

    const removeVeterinaryCare = async (req, res) => {
        const idVeterinaryCare = req.params.id ? req.params.id : res.status(400).send('Identificação do cuidado veterinário não informado')

        let veterinaryCaresId = idVeterinaryCare.split(',')

        veterinaryCaresId.forEach(async (idVeterinaryCare) => {
            await app.db('veterinary-cares')
                .where({ id: idVeterinaryCare })
                .del()
                .then(_ => console.log(`Cuidado veterinário de id: ${idVeterinaryCare} deletado`))
                .catch(err => {
                    console.log(err)
                    app.api.bugReport.writeInBugReport(err, path.basename(__filename))
                    res.status(500).send('Ocorreu um erro ao deletar cuidado veterinário')
                })
        })

        res.status(200).send('Cuidado veterinário removido com sucesso!')
    }
    return { save, removeVeterinaryCare }
}