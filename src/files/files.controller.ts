import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { newNameFile } from './helpers/fileName.helper';
import { Response } from 'express'
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {

  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) { }

  //queda en la ruta como /files/product, 
  @Post('product')
  //file es el nombre de como se recibe la llave 
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter, //helper mandamos la referencia no la ejecutamos
    // limits:{fieldSize:1000} ////para peso del archivo validacion
    storage: diskStorage({
      destination: './staticFiles/uploads', // destino en donde voy a poner el archivo
      filename: newNameFile //para cambiar el nombre del archivo solo se pone la refencia de la funcion 
    })
  }))
  //README: hay que instalar npm i -D @types/multer para tipar un archivo
  uploadFile(
    @UploadedFile()
    file: Express.Multer.File) {

    console.log({ archivoPermitido: file });

    if (!file) throw new BadRequestException('No se ha enviado una imagen')

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`

    return {
      secureUrl
    }
  }


  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,// es la response de exress, se rompe la funcionalidad del metodo es para que tome el control el Res nativo 
    @Param('imageName') imageName: string
  ) {

    const path = this.filesService.getStaticProductImage(imageName)

    return res.sendFile(path)

    return res.status(200).json({
      ok: true,
      path
    })
  }


}
