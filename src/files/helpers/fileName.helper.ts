import { v4 as uuid } from 'uuid'


export const newNameFile = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

    if (!file) return callback(new Error('File is empty'), false) // false es para decir que no aceptamos el archivo

    const fileExtension = file.mimetype.split('/')[1]

    const myFileName = `${uuid()}.${fileExtension}`

    callback(null, myFileName)
}