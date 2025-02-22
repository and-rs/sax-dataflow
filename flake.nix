{
  description = "A basic flake with node";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
  inputs.systems.url = "github:nix-systems/default";
  inputs.flake-utils = {
    url = "github:numtide/flake-utils";
    inputs.systems.follows = "systems";
  };

  outputs = { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        # Function to create script (alias)
        mkScript = name: text:
          let script = pkgs.writeShellScriptBin name text;
          in script;

        # Define your scripts
        scripts = [
          (mkScript "cdk" ''
            pnpx aws-cdk "$@"
          '')
        ];
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = [ pkgs.nodejs_22 ]
            ++ scripts; # Adding scripts to the environment
        };
      });
}
