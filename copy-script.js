import fs from 'fs'
import path from "path";
const isProd = process.argv[process.argv.length - 1] == 'prod'
const sourcePath = './MP_verify_Rud3clNqjOfcMeVL.txt';
const destinationPath = `../h5/jd-phonesale${isProd ? '' : '-dev'}`;
fs.mkdirSync(destinationPath, { recursive: true });
const fileName = path.basename(sourcePath);
const destFilePath = path.join(destinationPath, fileName);
fs.copyFileSync(sourcePath, destFilePath);
console.log('文件复制完成！');