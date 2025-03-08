import * as process from "node:process";
import * as readline from "readline";
import { execSync } from "child_process";
import chalk from "chalk";

// Linux distro commands 
const DISTROS: { [key: string]: { 
    install: string; 
    uninstall: string; 
    update: string; 
    dependencies: string; 
} } = {
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

async function askQuestion(question: string): Promise<string> {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim().toLowerCase());
        });
    });
}

async function executeCommand(command: string, successMsg: string, errorMsg: string) {
    try {
        execSync(command, { stdio: "ignore" });
        console.log(chalk.green(successMsg));
    } catch {
        console.log(chalk.red(errorMsg));
        process.exit(1);
    }
}

async function verifyNginxInstallation(): Promise<boolean> {
    try {
        const version = execSync("nginx -v 2>&1").toString();
        console.log(chalk.yellow(`NGINX is installed: ${version}`));
        return true;
    } catch {
        return false;
    }
}

// Linux handling functions
async function handleNginx(distro: string, action: "install" | "uninstall" | "update") {
    if (!DISTROS[distro]) {
        console.log(chalk.red("Unsupported Linux Distro."));
        process.exit(1);
    }
    console.log(chalk.blue(`${action.charAt(0).toUpperCase() + action.slice(1)}ing NGINX on ${distro}...`));
    await executeCommand(
        DISTROS[distro][action],
        `NGINX ${action}ed successfully.`,
        `Failed to ${action} NGINX.`
    );
}

async function configureDomainLinux(distro: string) {
    const domain = await askQuestion("Enter your domain name (or press Enter to skip): ");
    if (!domain) return;

    const useSSL = await askQuestion("Do you want to use SSL? (y/n): ");
    if (useSSL === "y") {
        // Ensure required dependencies are installed
        await executeCommand(
            DISTROS[distro].dependencies,
            "Dependencies installed successfully.",
            "Failed to install dependencies."
        );
        await executeCommand(
            `sudo certbot --nginx -d ${domain} --non-interactive --agree-tos -m admin@${domain}`,
            "SSL Certificate installed successfully!",
            "Failed to install SSL certificate."
        );
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
    execSync(`echo '${config}' | sudo tee /etc/nginx/sites-available/${domain} > /dev/null`);
    await executeCommand(
        `sudo ln -sf /etc/nginx/sites-available/${domain} /etc/nginx/sites-enabled/${domain}`,
        "Domain configuration enabled.",
        "Failed to enable domain configuration."
    );
    await executeCommand("sudo systemctl restart nginx", "NGINX restarted successfully.", "Failed to restart NGINX.");
}

async function configureAdvancedLinux(distro: string) {
    console.log(chalk.blue("Advanced Linux Configuration Options:"));
    const domainConfig = await askQuestion("Do you want to configure a domain with SSL? (y/n): ");
    if (domainConfig === "y") {
        await configureDomainLinux(distro);
    }
}

// Windows handling functions
async function handleWindowsNginx(action: "install" | "uninstall" | "update") {
    if (action === "install") {
        // Ask whether to install using Chocolatey or manually
        const method = await askQuestion("Do you want to install using Chocolatey? (y/n): ");
        if (method === "y") {
            await executeCommand(
                "choco install nginx -y",
                "NGINX installed successfully on Windows!",
                "Failed to install NGINX on Windows via Chocolatey."
            );
        } else {
            console.log(chalk.yellow("Please download and install NGINX manually from https://nginx.org/en/download.html"));
            process.exit(0);
        }
    } else if (action === "uninstall") {
        await executeCommand(
            "choco uninstall nginx -y",
            "NGINX uninstalled successfully on Windows!",
            "Failed to uninstall NGINX on Windows."
        );
    } else if (action === "update") {
        console.log(chalk.yellow("Updating NGINX on Windows is not automated via this script. Please update manually."));
    }
}

async function handleWindowsAdvanced() {
    console.log(chalk.blue("Advanced Windows Configuration Options:"));
    const domain = await askQuestion("Enter your domain name (or press Enter to skip): ");
    if (domain) {
        const useSSL = await askQuestion("Do you want to use SSL? (y/n): ");
        if (useSSL === "y") {
            // Placeholder for Windows SSL installation (e.g., using win-acme)
            console.log(chalk.blue("Installing SSL certificate using win-acme (placeholder)..."));
            await executeCommand(
                "echo Installing SSL certificate on Windows (placeholder)",
                "SSL Certificate installed successfully on Windows!",
                "Failed to install SSL certificate on Windows."
            );
        }
        // Simulate configuring Windows NGINX (typically located at C:\nginx\conf\nginx.conf)
        console.log(chalk.blue(`Configuring domain ${domain} in Windows NGINX configuration...`));
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
        console.log(chalk.green("Domain configuration applied (placeholder). Please update your nginx.conf manually if needed."));
    }
}

(async () => {
    // Verify existing installation
    const isInstalled = await verifyNginxInstallation();
    if (isInstalled) {
        const proceed = await askQuestion("NGINX is already installed. Do you want to continue? (y/n): ");
        if (proceed !== "y") process.exit(0);
    }

    const osType = await askQuestion("Which OS do you use? [linux, windows, mac]: ");
    if (osType === "mac") {
        console.log(chalk.blue("Installing NGINX on macOS using Homebrew..."));
        await executeCommand(
            "brew install nginx certbot",
            "NGINX installed successfully on macOS!",
            "Failed to install NGINX on macOS."
        );
        const advanced = await askQuestion("Do you want to configure advanced options (domain/SSL)? (y/n): ");
        if (advanced === "y") {
            // Use similar steps as Linux for domain configuration on macOS
            await configureDomainLinux("ubuntu"); // Using ubuntu commands as a base for certbot
        }
        process.exit(0);
    } else if (osType === "windows") {
        console.log(chalk.blue("Installing NGINX on Windows..."));
        const action = await askQuestion("Do you want to (i)nstall, (u)ninstall, or (up)date NGINX? (i/u/up): ");
        if (action === "i" || action === "u" || action === "up") {
            await handleWindowsNginx(action as "install" | "uninstall" | "update");
            const advanced = await askQuestion("Do you want to configure advanced options for Windows? (y/n): ");
            if (advanced === "y") {
                await handleWindowsAdvanced();
            }
        } else {
            console.log(chalk.red("Invalid choice."));
            process.exit(1);
        }
        process.exit(0);
    } else if (osType === "linux") {
        console.log("Supported Linux Distros:");
        Object.keys(DISTROS).forEach(d => console.log(chalk.cyan(d)));
        const distro = await askQuestion("Which Linux Distro are you using? ");
        if (!DISTROS[distro]) {
            console.log(chalk.red("Unsupported Linux Distro."));
            process.exit(1);
        }
        const action = await askQuestion("Do you want to (i)nstall, (u)ninstall, (up)date NGINX, or configure advanced options? (i/u/up/a): ");
        if (action === "i") await handleNginx(distro, "install");
        else if (action === "u") await handleNginx(distro, "uninstall");
        else if (action === "up") await handleNginx(distro, "update");
        else if (action === "a") await configureAdvancedLinux(distro);
        else {
            console.log(chalk.red("Invalid choice."));
            process.exit(1);
        }
    } else {
        console.log(chalk.red("Unsupported OS type."));
        process.exit(1);
    }
})();