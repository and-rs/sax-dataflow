{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  buildInputs = [
    pkgs.bun
    pkgs.biome
    pkgs.nodejs_22

    pkgs.corepack_latest
    pkgs.pnpm-shell-completion

    pkgs.nodePackages.aws-cdk
  ];
}
