/*jslint strict: false, plusplus: false */
/*global Packages: false */
/*
 * See: http://github.com/jrburke/dvcs_jslint
 */
var rhinoPath = arguments[0],
    jslintPath = arguments[1],
    repoType = arguments[2],
    io = Packages.java.io,
    lang = Packages.java.lang,
    jsExtRegExp = /\.js\s*$/,
    okRegExp = /No problems found/,
    process, reader, input = "", line, lines = [], files = [], file, i,
    gitModRegExp = /(new file|modified)\:\s*(\S+\.js)\s*/,
    gitNotUpdated = "Changed but not updated",
    gitUntracked = "Untracked files:",
    cmd = rhinoPath + " " + jslintPath + " ",
    dvCmd = repoType === "hg" ? "hg status" : "git status",
    match;

if (repoType !== "hg" && repoType !== "git") {
    throw "Unsupported repo type: " + repoType + ". Valid values are hg or git.";
}

//Get list of changed files.
process = lang.Runtime.getRuntime().exec(dvCmd);
reader = new io.BufferedReader(new io.InputStreamReader(process.getInputStream()));
while ((line = reader.readLine())) {
    lines.push(line);
}

reader.close();
process.destroy();

if (lines.length) {
    if (repoType === "hg") {
        for (i = 0; i < lines.length; i++) {
            line = lines[i];
            if ((line.charAt(0) === "A" || line.charAt(0) === "M") && jsExtRegExp.test(line)) {
                //Added or modified JS file, add to list.
                files.push(line.substring(2, line.length));
            }
        }
    } else if (repoType === "git") {
        for (i = 0; i < lines.length; i++) {
            line = lines[i];
            if (line.indexOf(gitNotUpdated) !== -1 || line.indexOf(gitUntracked) !== -1) {
                break;
            }
            match = gitModRegExp.exec(line);
            if (match) {
                files.push(match[2]);
            }
        }
    }

    //For each file, call jslint.
    if (files.length) {
        for (i = 0; i < files.length; i++) {
            input = "";
            file = files[i];
            process = lang.Runtime.getRuntime().exec(cmd + file);
            reader = new io.BufferedReader(new io.InputStreamReader(process.getInputStream()));
            while ((line = reader.readLine())) {
                input += line + "\n";
            }

            reader.close();
            process.destroy();

            if (!okRegExp.test(input)) {
                throw "JSLint error in " + file + ":\n" + input;
            }
        }
    }
}
