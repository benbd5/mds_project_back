const router = require('express').Router()
const sessionController = require('../controller/sessionController')

router.get('/sessions', sessionController.getAllSessions)
router.get('/session/:id', sessionController.getOneSession)

router.post('/add', sessionController.postSession)

router.patch('/edit_session', sessionController.patchSession)

router.delete('/delete_session', sessionController.deleteSession)

module.exports = router
