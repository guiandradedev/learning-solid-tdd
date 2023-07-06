import fs from 'fs'

export const deleteFile = async (file: string) => {
    try {
        await fs.promises.stat(file)
    } catch {
        return;
    }

    await fs.promises.unlink(file)
}