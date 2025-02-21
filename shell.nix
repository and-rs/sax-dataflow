{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  buildInputs = [
    pkgs.corepack_latest
    pkgs.pnpm-shell-completion

    pkgs.nodejs_22
    pkgs.nodePackages.aws-cdk
  ];
}
