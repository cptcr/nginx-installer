# TypeScript NGINX Installer

![License](https://img.shields.io/badge/license-MIT-green) ![Language](https://img.shields.io/badge/language-TypeScript-blue)

## About
**TypeScript NGINX Installer** is a script designed to automate the installation, updating, uninstallation, and configuration of NGINX across multiple operating systems. It also provides options for domain configuration and SSL certificate setup using Let's Encrypt.

## License
This project is licensed under the **MIT License** by **CPTCR**.

## Supported Operating Systems
| OS                        | Support Status | Notes |
|---------------------------|---------------|-------|
| Ubuntu                    | 🟢 Supported  | Fully functional, installs NGINX, Certbot, and dependencies. |
| Debian                    | 🟢 Supported  | Same as Ubuntu, stable setup. |
| CentOS                    | 🟢 Supported  | Uses YUM package manager. |
| Red Hat Enterprise Linux  | 🟢 Supported  | Uses YUM, requires EPEL repository. |
| Fedora                    | 🟢 Supported  | Uses DNF for package management. |
| SUSE Linux Enterprise     | 🟢 Supported  | Uses Zypper for package management. |
| Alpine Linux              | 🟢 Supported  | Uses APK package manager, lightweight setup. |
| Amazon Linux              | 🟢 Supported  | Uses Amazon Linux Extras to install NGINX. |
| macOS                     | 🟡 Maybe      | Installs via Homebrew, requires manual configuration. |
| Windows (via Chocolatey)  | 🟡 Maybe      | Installs via Chocolatey, manual setup required for advanced features. |
| Windows (Manual Install)  | 🔴 Not Supported | No automated setup, users need to configure NGINX manually. |

> [!IMPORTANT]
> **Ensure that you have the necessary permissions before running the script.**
> Some commands require **sudo/root access** to install and configure NGINX properly.

> [!TIP]
> **It's always a good idea to update your package manager before installation.**
> Run the following command based on your OS:
> ```sh
> sudo apt update  # For Debian-based distros
> sudo yum update  # For RHEL-based distros
> sudo dnf update  # For Fedora
> brew update      # For macOS
> ```

> [!WARN]
> **Incorrect configuration changes can break your web server.**
> Always back up your configuration files before modifying them:
> ```sh
> sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak
> ```

## Prerequisites
Before running this script, ensure that you have:
- **Node.js** (v16+ recommended) installed.
- **TypeScript compiler** installed globally via:
  ```sh
  npm install -g typescript
  ```
- **ts-node** installed globally via:
  ```sh
  npm install -g ts-node
  ```
- **For Linux/macOS**, ensure you have `curl` installed and proper sudo privileges.
- **For Windows**, ensure you have [Chocolatey](https://chocolatey.org/install) installed if using the automated install method.

## How to Run
1. Clone the repository or download the script.
2. Navigate to the script's directory:
   ```sh
   cd path/to/script
   ```
3. Run the script using `ts-node`:
   ```sh
   npm run install
   ```
4. Follow the on-screen prompts to install, uninstall, or configure NGINX.

## Features
- ✅ Installs, updates, or uninstalls NGINX
- ✅ Installs necessary dependencies (Certbot, etc.)
- ✅ Configures domain and reverse proxy settings
- ✅ Sets up SSL certificates with Let's Encrypt
- ✅ Supports multiple Linux distributions, macOS, and Windows (Chocolatey)

## Notes
- On **Windows**, additional manual configuration might be required for SSL certificates.
- On **macOS**, domain configuration requires manual verification.
- Some **minimal Linux distributions** may require additional dependencies.

For any issues, feel free to open a pull request or report an issue!
