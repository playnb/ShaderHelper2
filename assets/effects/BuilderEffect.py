# -*- coding: UTF-8 -*-

import os


def buildIndex(content, dir):
    with open(os.path.join(dir, 'index.json'), 'rb') as f:
        lines = f.readlines()
        lines[0] = "%{\n"
        lines[-1] = "%}\n\n"
        for l in lines:
            if l[-1:] == '\n':
                content += l[0:-1]
            else:
                content += l
    return content


def buildGLSL(content, dir, fileName):
    with open(os.path.join(dir, fileName+'.glsl'), 'rb') as f:
        content += '\n%% '+fileName+' {\n'
        lines = f.readlines()
        for l in lines:
            content += "  "
            if l[-1:] == '\n':
                content += l[0:-1]
            else:
                content += l
        content += "\n}\n\n"
    return content


def save(content, dir, name):
    fileName = os.path.join(dir, name+'.effect')
    with open(fileName, 'w+') as f:
        f.write(content)
    return fileName
# print(content)


if __name__ == '__main__':
    shaderRoot = "../resources/effects"
    for root, dirs, _ in os.walk(".", topdown=False):
        # for name in files:
        #    print(os.path.join(root, name))
        for shaderName in dirs:
            #print(os.path.join(root, shaderName))
            content = ""
            hasShader = False
            for shaderBase, _, files in os.walk(os.path.join(root, shaderName), topdown=False):
                for name in files:
                    if name == 'index.json':
                        hasShader = True
                        content = buildIndex(content, shaderBase)
                for name in files:
                    if os.path.splitext(name)[1] == ".glsl":
                        content = buildGLSL(
                            content, shaderBase, os.path.splitext(name)[0])
            if hasShader:
                print('Make:'+save(content, shaderRoot, shaderName))
