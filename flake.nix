{
  description = "AWS CDK Development Environment";

  inputs = {
    nixpkgs.url =
      "github:NixOS/nixpkgs/nixos-24.11"; # Using latest before unstable
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShells.default = pkgs.mkShell {
          buildInputs =
            [ pkgs.nodejs_22 pkgs.corepack pkgs.nodePackages.aws-cdk ];

          # shellHook = ''
          #   export npm_config_unsafe_perm=true
          # '';
        };
      });
}
