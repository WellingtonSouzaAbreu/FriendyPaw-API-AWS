const path = require('path')
const fs = require('fs')

module.exports = app => {
    const { showLog, showAndRegisterError } = app.api.commonFunctions

    const validateRequestDataForDelete = async (req, target) => {
        const { isValidId } = app.api.validation
        const { convertStringWithCommaToArray } = app.api.commonFunctions

        const idCollaborator = req.params.id && req.params.id
        if (!idCollaborator) throw `Identificação do ${target} não informada!`

        let collaboratorsId = convertStringWithCommaToArray(idCollaborator)

        const validIds = collaboratorsId.filter(id => isValidId(id))
        if (!validIds.length) throw `Não foi informado nenhum identificador válido!`

        return validIds
    }

    const deleteFromDatabase = async (validIds, target, targetTable, where = 'id') => {
        const executions = validIds.map(async (id) => {
            return await app.db(targetTable)
                .where({ [where]: id })
                .del()
                .then(_ => {
                    showLog(`${target} de id: ${id} deletado!`)
                    return true
                })
                .catch(err => {
                    showAndRegisterError(err, path.basename(__filename))
                    return false
                })
        })

        return executions.reduce((total, current) => total && current, true)
    }

    const deleteFromPictureDatabase = async (validIds, table, where) => {
        const unlinked = validIds.map(async (id) => {
            return await app.db(table)
                .select('imageURL')
                .where({ [where]: id })
                .then(async imagesURL => {
                    try {
                        if (imagesURL.length > 0) {
                            await deleteSavedFiles(imagesURL)
                            return true
                        }
                    } catch (err) {
                        return false
                    }
                })
                .catch(err => {
                    showAndRegisterError(err, path.basename(__filename))
                    showLog('Erro ao remover imagens anteriores')
                    throw 'Erro ao deletar imagem!'
                })
        })

        return unlinked.reduce((total, current) => total && current, true)
    }

    const deleteSavedFiles = async (imagesURL) => {
        imagesURL.map(async (imageURL) => {
            await deleteFile(`${__dirname}/../_remoteMonitoringPictures/${imageURL.imageURL}`)
        })
    }

    const deleteFile = async (filePath) => {
        fs.unlink(filePath, (err) => {
            if (!err) {
                showLog('Imagem deletada com sucesso!');
            } else {
                showAndRegisterError(err, path.basename(__filename))
                showLog('Erro ao deletar imagem!');
                throw 'Erro ao deletar imagem!'
            }
        })
    }
    return { validateRequestDataForDelete, deleteFromDatabase, deleteFromPictureDatabase }
}