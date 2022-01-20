const router = require('express').Router()

const sessionController = require('../controller/sessionController')

// const withAuth = require('../middlewares/authMiddleware')

router.get('/sessions', sessionController.getAllSessions)
router.get('/session/:id', sessionController.getOneSession)

router.get('/sport-values', sessionController.getSports)

router.post('/add', sessionController.postSession)

router.patch('/edit_session/:id', sessionController.patchSession)

router.patch('/member/:id', sessionController.memberOfSession)

router.delete('/delete_session', sessionController.deleteSession)

module.exports = router
