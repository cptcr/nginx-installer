"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process = __importStar(require("node:process"));
const readline = __importStar(require("readline"));
const child_process_1 = require("child_process");
const chalk_1 = __importDefault(require("chalk"));
// Linux distro commands 
const DISTROS = {
    ubuntu: {
        install: "sudo apt update -y && sudo apt install -y nginx certbot python3-certbot-nginx",
        uninstall: "sudo apt remove --purge -y nginx && sudo apt autoremove -y",
        update: "sudo apt update -y && sudo apt upgrade -y nginx",
        dependencies: "sudo apt update -y && sudo apt install -y curl software-properties-common"
    },
    debian: {
        install: "sudo apt update -y && sudo apt install -y nginx certbot python3-certbot-nginx",
        uninstall: "sudo apt remove --purge -y nginx && sudo apt autoremove -y",
        update: "sudo apt update -y && sudo apt upgrade -y nginx",
        dependencies: "sudo apt update -y && sudo apt install -y curl software-properties-common"
    },
    centos: {
        install: "sudo yum install -y epel-release && sudo yum install -y nginx certbot python3-certbot-nginx",
        uninstall: "sudo yum remove -y nginx",
        update: "sudo yum update -y nginx",
        dependencies: "sudo yum install -y curl"
    },
    "red hat enterprise linux (rhel)": {
        install: "sudo yum install -y epel-release && sudo yum install -y nginx certbot python3-certbot-nginx",
        uninstall: "sudo yum remove -y nginx",
        update: "sudo yum update -y nginx",
        dependencies: "sudo yum install -y curl"
    },
    fedora: {
        install: "sudo dnf install -y nginx certbot python3-certbot-nginx",
        uninstall: "sudo dnf remove -y nginx",
        update: "sudo dnf update -y nginx",
        dependencies: "sudo dnf install -y curl"
    },
    suse: {
        install: "sudo zypper install -y nginx certbot",
        uninstall: "sudo zypper remove -y nginx",
        update: "sudo zypper update -y nginx",
        dependencies: "sudo zypper install -y curl"
    },
    alpine: {
        install: "apk add --no-cache nginx certbot",
        uninstall: "apk del nginx",
        update: "apk upgrade nginx",
        dependencies: "apk add --no-cache curl"
    },
    amazon: {
        install: "sudo amazon-linux-extras enable nginx1 && sudo yum install -y nginx certbot",
        uninstall: "sudo yum remove -y nginx",
        update: "sudo yum update -y nginx",
        dependencies: "sudo yum install -y curl"
    }
};
function askQuestion(question) {
    return __awaiter(this, void 0, void 0, function* () {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                rl.close();
                resolve(answer.trim().toLowerCase());
            });
        });
    });
}
function executeCommand(command, successMsg, errorMsg) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, child_process_1.execSync)(command, { stdio: "ignore" });
            console.log(chalk_1.default.green(successMsg));
        }
        catch (_a) {
            console.log(chalk_1.default.red(errorMsg));
            process.exit(1);
        }
    });
}
function verifyNginxInstallation() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const version = (0, child_process_1.execSync)("nginx -v 2>&1").toString();
            console.log(chalk_1.default.yellow(`NGINX is installed: ${version}`));
            return true;
        }
        catch (_a) {
            return false;
        }
    });
}
// Linux handling functions
function handleNginx(distro, action) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!DISTROS[distro]) {
            console.log(chalk_1.default.red("Unsupported Linux Distro."));
            process.exit(1);
        }
        console.log(chalk_1.default.blue(`${action.charAt(0).toUpperCase() + action.slice(1)}ing NGINX on ${distro}...`));
        yield executeCommand(DISTROS[distro][action], `NGINX ${action}ed successfully.`, `Failed to ${action} NGINX.`);
    });
}
function configureDomainLinux(distro) {
    return __awaiter(this, void 0, void 0, function* () {
        const domain = yield askQuestion("Enter your domain name (or press Enter to skip): ");
        if (!domain)
            return;
        const useSSL = yield askQuestion("Do you want to use SSL? (y/n): ");
        if (useSSL === "y") {
            // Ensure required dependencies are installed
            yield executeCommand(DISTROS[distro].dependencies, "Dependencies installed successfully.", "Failed to install dependencies.");
            yield executeCommand(`sudo certbot --nginx -d ${domain} --non-interactive --agree-tos -m admin@${domain}`, "SSL Certificate installed successfully!", "Failed to install SSL certificate.");
        }
        // Create a basic reverse proxy server block for the domain
        const config = `
server {
    listen 80;
    server_name ${domain};
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
`;
        (0, child_process_1.execSync)(`echo '${config}' | sudo tee /etc/nginx/sites-available/${domain} > /dev/null`);
        yield executeCommand(`sudo ln -sf /etc/nginx/sites-available/${domain} /etc/nginx/sites-enabled/${domain}`, "Domain configuration enabled.", "Failed to enable domain configuration.");
        yield executeCommand("sudo systemctl restart nginx", "NGINX restarted successfully.", "Failed to restart NGINX.");
    });
}
function configureAdvancedLinux(distro) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(chalk_1.default.blue("Advanced Linux Configuration Options:"));
        const domainConfig = yield askQuestion("Do you want to configure a domain with SSL? (y/n): ");
        if (domainConfig === "y") {
            yield configureDomainLinux(distro);
        }
    });
}
// Windows handling functions
function handleWindowsNginx(action) {
    return __awaiter(this, void 0, void 0, function* () {
        if (action === "install") {
            // Ask whether to install using Chocolatey or manually
            const method = yield askQuestion("Do you want to install using Chocolatey? (y/n): ");
            if (method === "y") {
                yield executeCommand("choco install nginx -y", "NGINX installed successfully on Windows!", "Failed to install NGINX on Windows via Chocolatey.");
            }
            else {
                console.log(chalk_1.default.yellow("Please download and install NGINX manually from https://nginx.org/en/download.html"));
                process.exit(0);
            }
        }
        else if (action === "uninstall") {
            yield executeCommand("choco uninstall nginx -y", "NGINX uninstalled successfully on Windows!", "Failed to uninstall NGINX on Windows.");
        }
        else if (action === "update") {
            console.log(chalk_1.default.yellow("Updating NGINX on Windows is not automated via this script. Please update manually."));
        }
    });
}
function handleWindowsAdvanced() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(chalk_1.default.blue("Advanced Windows Configuration Options:"));
        const domain = yield askQuestion("Enter your domain name (or press Enter to skip): ");
        if (domain) {
            const useSSL = yield askQuestion("Do you want to use SSL? (y/n): ");
            if (useSSL === "y") {
                // Placeholder for Windows SSL installation (e.g., using win-acme)
                console.log(chalk_1.default.blue("Installing SSL certificate using win-acme (placeholder)..."));
                yield executeCommand("echo Installing SSL certificate on Windows (placeholder)", "SSL Certificate installed successfully on Windows!", "Failed to install SSL certificate on Windows.");
            }
            // Simulate configuring Windows NGINX (typically located at C:\nginx\conf\nginx.conf)
            console.log(chalk_1.default.blue(`Configuring domain ${domain} in Windows NGINX configuration...`));
            const winConfig = `
server {
    listen       80;
    server_name  ${domain};
    location / {
        proxy_pass         http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection "upgrade";
        proxy_set_header   Host $host;
    }
}
`;
            console.log(chalk_1.default.green("Domain configuration applied (placeholder). Please update your nginx.conf manually if needed."));
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Verify existing installation
    const isInstalled = yield verifyNginxInstallation();
    if (isInstalled) {
        const proceed = yield askQuestion("NGINX is already installed. Do you want to continue? (y/n): ");
        if (proceed !== "y")
            process.exit(0);
    }
    const osType = yield askQuestion("Which OS do you use? [linux, windows, mac]: ");
    if (osType === "mac") {
        console.log(chalk_1.default.blue("Installing NGINX on macOS using Homebrew..."));
        yield executeCommand("brew install nginx certbot", "NGINX installed successfully on macOS!", "Failed to install NGINX on macOS.");
        const advanced = yield askQuestion("Do you want to configure advanced options (domain/SSL)? (y/n): ");
        if (advanced === "y") {
            // Use similar steps as Linux for domain configuration on macOS
            yield configureDomainLinux("ubuntu"); // Using ubuntu commands as a base for certbot
        }
        process.exit(0);
    }
    else if (osType === "windows") {
        console.log(chalk_1.default.blue("Installing NGINX on Windows..."));
        const action = yield askQuestion("Do you want to (i)nstall, (u)ninstall, or (up)date NGINX? (i/u/up): ");
        if (action === "i" || action === "u" || action === "up") {
            yield handleWindowsNginx(action);
            const advanced = yield askQuestion("Do you want to configure advanced options for Windows? (y/n): ");
            if (advanced === "y") {
                yield handleWindowsAdvanced();
            }
        }
        else {
            console.log(chalk_1.default.red("Invalid choice."));
            process.exit(1);
        }
        process.exit(0);
    }
    else if (osType === "linux") {
        console.log("Supported Linux Distros:");
        Object.keys(DISTROS).forEach(d => console.log(chalk_1.default.cyan(d)));
        const distro = yield askQuestion("Which Linux Distro are you using? ");
        if (!DISTROS[distro]) {
            console.log(chalk_1.default.red("Unsupported Linux Distro."));
            process.exit(1);
        }
        const action = yield askQuestion("Do you want to (i)nstall, (u)ninstall, (up)date NGINX, or configure advanced options? (i/u/up/a): ");
        if (action === "i")
            yield handleNginx(distro, "install");
        else if (action === "u")
            yield handleNginx(distro, "uninstall");
        else if (action === "up")
            yield handleNginx(distro, "update");
        else if (action === "a")
            yield configureAdvancedLinux(distro);
        else {
            console.log(chalk_1.default.red("Invalid choice."));
            process.exit(1);
        }
    }
    else {
        console.log(chalk_1.default.red("Unsupported OS type."));
        process.exit(1);
    }
}))();
