const router = require('express').Router()

const sessionController = require('../controller/sessionController')

const withAuth = require('../middlewares/authMiddleware')

router.get('/sessions', sessionController.getAllSessions)
router.get('/session/:id', sessionController.getOneSession)

router.get('/sport-values', sessionController.getSports)

router.post('/add', withAuth, sessionController.postSession)

router.patch('/edit_session/:id', withAuth, sessionController.patchSession)

router.patch('/member/:id', withAuth, sessionController.memberOfSession)

router.delete('/delete_session', withAuth, sessionController.deleteSession)

module.exports = router
