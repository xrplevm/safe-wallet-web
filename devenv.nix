{ pkgs, ... }:

{
  # Node version matches .nvmrc (22.x). Yarn 4 comes from corepack (packageManager in package.json).
  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_22;
    corepack.enable = true;
  };

  # Native build dependencies for `yarn install` (Ledger/USB modules).
  packages = [
    pkgs.python3
    pkgs.gnumake
    pkgs.gcc
    pkgs.pkg-config
    pkgs.libusb1
    pkgs.udev
  ];

  env = {
    COREPACK_ENABLE_DOWNLOAD_PROMPT = "0";
    NEXT_TELEMETRY_DISABLED = "1";
    # Some tests format numbers; a non-English system locale makes them fail.
    LANG = "en_US.UTF-8";
    LC_ALL = "en_US.UTF-8";
  };

  scripts = {
    web-build.exec = ''
      cd "$DEVENV_ROOT/apps/web" && yarn build && sh scripts/check-brand.sh out
    '';
    web-check-brand.exec = ''
      cd "$DEVENV_ROOT/apps/web" && sh scripts/check-brand.sh out
    '';
    web-serve.exec = ''
      cd "$DEVENV_ROOT/apps/web" && npx -y serve out -p ''${PORT:-3000}
    '';
  };

  enterShell = ''
    echo "XRPL EVM Multisig dev shell: node $(node -v), yarn $(yarn -v)"
    echo "Set NEXT_PUBLIC_GATEWAY_URL_PRODUCTION (and NEXT_PUBLIC_IS_PRODUCTION / NEXT_PUBLIC_DEFAULT_MAINNET_CHAIN_ID) before web-build."
  '';
}
