const COSSECRET = {
    SecretId: 'your-secret-id',
    SecretKey: 'your-secret-key',
};

const cos = new COS({
    SecretId: COSSECRET.SecretId,
    SecretKey: COSSECRET.SecretKey,
});

const uploadFile = (filePath: string, key: string) => {
    cos.uploadFile({
        Bucket: 'your-bucket-name',
        Region: 'your-region',
        Key: key,
        FilePath: filePath,
    }, (err, data) => {
        if (err) {
            console.error('上传失败', err);
        } else {
            console.log('上传成功', data);
        }
    });
};

export { uploadFile };
