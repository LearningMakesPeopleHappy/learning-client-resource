const fs = require('fs');
const path = require('path');
const CryptoJS = require("crypto-js");
const marked = require('marked');

console.log(path.join(__dirname, 'version.json'));

const VersionFilePath = path.join(__dirname, 'version.json');
console.log('version.json path: ', VersionFilePath);
const BuildPath = path.join(__dirname, 'build');
const SrcPath = path.join(__dirname, 'src');
let Version;

fs.readFile(VersionFilePath, (err, data) => {
    if (err) {
        console.error('read version.json fail: ', err);
        if (err.code === 'ENOENT') {
            // 文件不存在
            Version = {
                version: 1,
                updateTime: (new Date()).getTime(),
            };
            WriteVersionJSON();
        } else {
            // 退出
        }
    } else {
        Version = JSON.parse(data.toString());
        console.log('read version.json: ', Version);
        Version.version++;
        Version.updateTime = (new Date()).getTime();
        WriteVersionJSON();
    }
});

/**
 * 写入version.json文件
 * 
 * @param {object} version 
 */
let WriteVersionJSON = (value) => {
    fs.writeFile(VersionFilePath, JSON.stringify(value ? value : Version), (err) => {
        if (err) {
            console.error('write version.json fail', err);
        } else {
            console.log('write version.json success');
            DeleteBuild();
        }
    });
}

/**
 * 删除build文件夹
 */
let DeleteBuild = () => {
    fs.stat(BuildPath, (err, stats) => {
        if (err) {
            console.error('delete build fail', err);
            if (err.code === 'ENOENT') {
                CreateBuild();
            }
        } else {
            if (stats.isDirectory()) {
                fsDeleteFolder(BuildPath).then(() => {
                    CreateBuild();
                }).catch((ferr) => {
                    console.error('delete build fail', ferr);
                });
            } else {
                CreateBuild();
            }
        }
    });
};

/**
 * 创建build文件夹
 */
let CreateBuild = () => {
    fs.mkdir(BuildPath, { recursive: true }, (err) => {
        if (err) {
            console.error('[Create] build fail', err);
        } else {
            console.log('[Create] build success');
            ReadSrc();
        }
    });
};

/**
 * 读取src下的文件和文件夹
 */
let ReadSrc = () => {
    fs.readdir(SrcPath, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error('[Read] src fail', err);
        } else {
            console.log('[Read] src success', files);

            let tempPromiseList = [];
            for (let i = 0, len = files.length; i < len; i++) {
                let tempItem = files[i];
                if (tempItem.name.charAt(0) !== '.') {
                    if (tempItem.isDirectory()) {
                        tempPromiseList.push(DealDirectory(tempItem, [], []));
                    } else if (tempItem.isFile()) {
                        tempPromiseList.push(DealFile(tempFileItem, [], []));
                    }
                } else {
                    console.log(tempFullPath, false);
                }
            }

            Promise.all(tempPromiseList).then((res) => {
                console.log('ReadSrc', res);
                WriteDirectoryJSON(res);
            }).catch(() => {
                
            });
        }
    });
};

/**
 * 处理文件夹
 * 
 * @param {fs.Dirent} item 要处理的文件夹
 * @param {string[]} parentPaths 相对于src的路径数组
 * @param {string[]} parentMD5Paths 相对于src的md5路径数组
 */
let DealDirectory = (item, parentPaths, parentMD5Paths) => {
    return new Promise((resolve, reject) => {
        const tempFullPath = path.join(SrcPath, ...parentPaths, item.name); // src下的路径
        const tempMD5Name = CryptoJS.MD5(item.name).toString(); // md5名称
        const tempNewPath = path.join(BuildPath, ...parentMD5Paths, tempMD5Name); // build下的路径
        console.log(tempFullPath, true);
        console.log('md5', tempMD5Name);

        fs.readdir(tempFullPath, { withFileTypes: true }, (err, files) => {
            if (err) {
                console.error(`[Read] ${tempFullPath} fail`, err);
                resolve();
            } else {
                console.log(`[Read] ${tempFullPath} success`, files);
                // 生成一个Object
                const newObject = {
                    id: CryptoJS.MD5(tempFullPath).toString(),
                    name: item.name,
                    path: parentMD5Paths,
                    isFolder: true,
                    type: 1,
                };

                if (files.length) {
                    fs.mkdir(tempNewPath, { recursive: true }, (err) => {
                        if (err) {
                            console.error(`[Create] ${tempNewPath} fail`, err);
                            resolve();
                        } else {
                            console.log(`[Create] ${tempNewPath} success`);
                            let tempPromiseList = [];
                            for (let i = 0, len = files.length; i < len; i++) {
                                let tempFileItem = files[i];
                                if (tempFileItem.name.charAt(0) !== '.') {
                                    if (tempFileItem.isDirectory()) {
                                        tempPromiseList.push(DealDirectory(tempFileItem, parentPaths.concat(item.name), parentMD5Paths.concat(tempMD5Name)));
                                    } else if (tempFileItem.isFile()) {
                                        tempPromiseList.push(DealFile(tempFileItem, parentPaths.concat(item.name), parentMD5Paths.concat(tempMD5Name)));
                                    }
                                }
                            }

                            Promise.all(tempPromiseList).then((res) => {
                                let tempResPreface;
                                let tempResList = res.filter((value) => {
                                    if (value) {
                                        if (value.name === 'README.md') {
                                            tempResPreface = value;
                                            return false;
                                        }

                                        return true;
                                    }

                                    return false;
                                });

                                if (tempResPreface) {
                                    newObject.preface = tempResPreface;
                                }

                                if (tempResList.length) {
                                    newObject.children = tempResList;
                                }
                                
                                resolve(newObject);
                            }).catch((error) => {
                                resolve();
                            });
                        }
                    });
                } else {
                    resolve(newObject);
                }
            }
        });
    });
}

/**
 * 处理文件
 * 
 * @param {fs.Dirent} item 要处理的文件
 * @param {string[]} parentPaths 相对于src的路径数组
 * @param {string[]} parentMD5Paths 相对于src的md5路径数组
 */
let DealFile = (item, parentPaths, parentMD5Paths) => {
    return new Promise((resolve, reject) => {
        const tempFullPath = path.join(SrcPath, ...parentPaths, item.name); // src下的路径
        const tempMD5Name = CryptoJS.MD5(item.name).toString(); // md5名称
        const tempExtName = path.extname(item.name);
        const tempNewPath = path.join(BuildPath, ...parentMD5Paths, (tempMD5Name + tempExtName)); // build下的路径
        console.log(tempFullPath, true);
        console.log('md5', tempMD5Name);

        fs.readFile(tempFullPath, (err, data) => {
            if (err) {
                console.error(`[read] ${tempFullPath} fail: `, err);
            } else {
                const fileType = getFileType(tempExtName);

                if (fileType === 2) { // Markdown
                    const dataString = data.toString();

                    const renderer = new marked.Renderer();
                    renderer.image = (href, title, text) => {
                        let newHref = href;
                        if (/^(http|https)/.test(href)) {

                        } else {
                            const sourceHref = path.parse(href);
                            const sourceHrefList = sourceHref.dir.split(path.sep);
                            const newHrefList = sourceHrefList.map((value) => {
                                if (value === '.' || value === '..') {
                                    return value;
                                }

                                return value.length ? CryptoJS.MD5(value).toString() : value;
                            });

                            newHref = path.format({
                                dir: newHrefList.join(path.sep),
                                root: sourceHref.root,
                                name: sourceHref.base && sourceHref.base.length ? CryptoJS.MD5(sourceHref.base).toString() : undefined,
                                ext: sourceHref.ext,
                            });
                        }

                        if (title) {
                            return `![${text}](${newHref} ${title})`;
                        }

                        return `![${text}](${newHref})`;
                    };

                    renderer.link = (href, title, text) => {
                        let newHref = href;
                        if (/^(http|https)/.test(href)) {

                        } else {
                            const sourceHref = path.parse(href);
                            const sourceHrefList = sourceHref.dir.split(path.sep);
                            const newHrefList = sourceHrefList.map((value) => {
                                if (value === '.' || value === '..') {
                                    return value;
                                }

                                return value.length ? CryptoJS.MD5(value).toString() : value;
                            });

                            newHref = path.format({
                                dir: newHrefList.join(path.sep),
                                root: sourceHref.root,
                                name: sourceHref.base && sourceHref.base.length ? CryptoJS.MD5(sourceHref.base).toString() : undefined,
                                ext: sourceHref.ext,
                            });
                        }

                        if (title) {
                            return `[${text}](${newHref} ${title})`;
                        }

                        return `[${text}](${newHref})`;
                    };

                    renderer.strong = (text) => {
                        return `**${text}**`;
                    };
                    renderer.em = (text) => {
                        return `_${text}_`;
                    };
                    renderer.codespan = (code) => {
                        return '`' + code +  '`';
                    };
                    // renderer.br = () => {
                    //     console.log('br');
                    //     return '<br />';
                    // };
                    // renderer.del = (text) => {
                    //     console.log('del', text);
                    //     return text;
                    // };
                    renderer.text = (text) => {
                        // console.log('text', text);
                        return text;
                    };

                    renderer.code = (code, infostring, escaped) => {
                        return '```' + (infostring ? infostring : '') + '\n' + code + '\n```\n\n';
                    };
                    renderer.blockquote = (quote) => {
                        return `> ${quote}`;
                    };
                    // renderer.html = (html) => {
                    //     console.log('html', html);
                    //     return html;
                    // };
                    renderer.heading = (text, level, raw, slugger) => {
                        let tempLevetString = '';
                        switch (level) {
                            case 1:
                                tempLevetString = '#';
                                break;
                            case 2:
                                tempLevetString = '##';
                                break;
                            case 3:
                                tempLevetString = '###';
                                break;
                            case 4:
                                tempLevetString = '####';
                                break;
                            case 5:
                                tempLevetString = '#####';
                                break;
                            case 6:
                                tempLevetString = '######';
                                break;
                        }
                        return `${tempLevetString} ${text}  \n\n`;
                    };
                    renderer.hr = () => {
                        return '---\n\n';
                    };
                    renderer.list = (body, ordered, start) => {
                        return body + '\n';
                    };
                    renderer.listitem = (text, task, checked) => {
                        return `* ${text}\n`;
                    };
                    // renderer.checkbox = (checked) => {
                    //     console.log('checkbox', checked);
                    //     return checked;
                    // };
                    renderer.paragraph = (text) => {
                        return `${text}  \n\n`;
                    };
                    // renderer.table = (header, body) => {
                    //     console.log('table', header, body);
                    //     return header;
                    // };
                    // renderer.tablerow = (content) => {
                    //     console.log('tablerow', content);
                    //     return content;
                    // };
                    // renderer.tablecell = (content, flags) => {
                    //     console.log('tablecell', content, flags);
                    //     return content;
                    // };

                    const datares = marked(dataString, {
                        renderer,
                    });

                    fs.writeFile(tempNewPath, datares, (err) => {
                        if (err) {
                            console.error(`[Write] ${tempFullPath} fail`, err);
                            resolve();
                        } else {
                            console.log(`[Write] ${tempFullPath} sucess`);
                            const fileType = getFileType(tempExtName);
                            if (fileType !== 0) {
                                resolve({
                                    id: CryptoJS.MD5(tempFullPath).toString(),
                                    name: item.name,
                                    path: parentMD5Paths,
                                    isFolder: false,
                                    type: fileType,
                                });
                            } else {
                                resolve();
                            }
                        }
                    });
                } else {
                    fs.copyFile(tempFullPath, tempNewPath, (err) => {
                        if (err) {
                            console.error(`[Copy] ${tempFullPath} fail`, err);
                            resolve();
                        } else {
                            console.error(`[Copy] ${tempFullPath} success`);
                            const fileType = getFileType(tempExtName);
                            if (fileType !== 0) {
                                resolve({
                                    id: CryptoJS.MD5(tempFullPath).toString(),
                                    name: item.name,
                                    path: parentMD5Paths,
                                    isFolder: false,
                                    type: fileType,
                                });
                            } else {
                                resolve();
                            }
                        }
                    });
                }
            }
        });
    });
}

let getFileType = (extname) => {
    const tempExtName = extname.toUpperCase();
    switch (tempExtName) {
        case '.MD':
            return 2;
        default:
            return 0;
    }
}

/**
 * 写入directory.json文件
 * 
 * @param {object} version 
 */
let WriteDirectoryJSON = (value) => {
    fs.writeFile(path.join(BuildPath, 'directory.json'), JSON.stringify(value), (err) => {
        if (err) {
            console.error('write directory.json fail', err);
        } else {
            console.log('write directory.json success');

            fs.writeFile(path.join(BuildPath, 'version.json'), JSON.stringify(Version), (err) => {
                if (err) {
                    console.error('[write] version.json fail', err);
                } else {
                    console.log('[write] version.json success');
                }
            });
        }
    });
}

/**
 * 删除一个文件/文件夹
 * 
 * @param {string} apath 要删除的项目的绝对路径
 */
let fsDelete = (apath) => {
    return new Promise((resolve, reject) => {
        fs.stat(apath, (err, stats) => {
            if (err) {
                reject(err);
            } else {
                if (stats.isDirectory()) {
                    fsDeleteFolder(apath).then(() => {
                        resolve();
                    }).catch((ferr) => {
                        reject(ferr);
                    });
                } else if (stats.isFile()) {
                    // 删除文件
                    fsDeleteFile(apath).then(() => {
                        resolve();
                    }).catch((ferr) => {
                        reject(ferr);
                    });
                } else {
                    reject();
                }
            }
        });
    });
    
}

/**
 * 递归删除文件夹
 * 
 * @param {string} folderpath 要删除的文件夹的绝对路径
 */
let fsDeleteFolder = (folderpath) => {
    return new Promise((resolve, reject) => {
        fs.readdir(folderpath, { withFileTypes: true }, (err, files) => {
            if (err) {
                reject(err);
            } else {
                if (files.length) {
                    const tempList = [];
                    for (let i = 0, len = files.length; i < len; i++) {
                        let tempItem = files[i];
                        if (tempItem.isDirectory()) {
                            tempList.push(fsDeleteFolder(path.join(folderpath, tempItem.name)));
                        } else if (tempItem.isFile()) {
                            // 删除文件
                            tempList.push(fsDeleteFile(path.join(folderpath, tempItem.name)));
                        } else {
                            reject();
                            return;
                        }
                    }

                    Promise.all(tempList).then(() => {
                        // 删除文件夹
                        fs.rmdir(folderpath, (rmdirErr) => {
                            if (rmdirErr) {
                                reject(rmdirErr);
                            } else {
                                console.log(`[Delete] ${folderpath} success`);
                                resolve();
                            }
                        });
                    }).catch((allErr) => {
                        reject(allErr);
                    });
                } else {
                    // 删除文件夹
                    fs.rmdir(folderpath, (rmdirErr) => {
                        if (rmdirErr) {
                            reject(rmdirErr);
                        } else {
                            console.log(`[Delete] ${folderpath} success`);
                            resolve();
                        }
                    });
                }
            }
        });
    });
}

/**
 * 删除文件
 * 
 * @param {string} filepath 要删除的文件的绝对路径
 */
let fsDeleteFile = (filepath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filepath, (err) => {
            if (err) {
                reject(err);
            } else {
                console.log(`[Delete] ${filepath} success`);
                resolve();
            }
        });
    });
}