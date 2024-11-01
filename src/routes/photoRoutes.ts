import { photoController } from '@/controllers/photo.controller';
import { CreatePhotoDto } from '@/dto/createPhoto.dto';
import validateDto from '@/middlewares/validateDto.middleware';
import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.get('/', photoController.getPhotos);

/**
 * @swagger
 * '/api/photo/{photoId}':
 *  get:
 *     tags:
 *     - Photos
 *     summary: Get a single photo by the photoId
 *     parameters:
 *      - name: photoId
 *        in: path
 *        description: The id of the photo
 *        required: true
 */
router.get('/:id', photoController.getPhoto);
router.post('/', photoController.createPhoto);

export default router;
