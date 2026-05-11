// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract PokeDIO is ERC721 {
    struct Pokemon {
        string name;
        uint256 level;
        string img;
    }

    Pokemon[] public pokemons;
    address public gameOwner;

    constructor() ERC721("PokeDIO", "PKD") {
        gameOwner = msg.sender;
    }

    /**
     * @dev Restricts function to the owner of the given token id.
     */
    modifier onlyOwnerOf(uint256 _monsterId) {
        require(ownerOf(_monsterId) == msg.sender, "Only the owner can battle with this Pokemon");
        _;
    }

    /**
     * @dev Battle between two Pokemons. Caller must own the attacking Pokemon.
     * Levels are adjusted depending on comparison.
     */
    function battle(uint256 _attackingPokemon, uint256 _defendingPokemon) public onlyOwnerOf(_attackingPokemon) {
        require(_attackingPokemon < pokemons.length, "Attacker does not exist");
        require(_defendingPokemon < pokemons.length, "Defender does not exist");
        require(_attackingPokemon != _defendingPokemon, "Cannot battle the same Pokemon");

        Pokemon storage attacker = pokemons[_attackingPokemon];
        Pokemon storage defender = pokemons[_defendingPokemon];

        if (attacker.level >= defender.level) {
            attacker.level += 2;
            defender.level += 1;
        } else {
            attacker.level += 1;
            defender.level += 2;
        }
    }

    /**
     * @dev Create a new Pokemon and mint an ERC721 token to `_to`.
     * Only the game owner can call this.
     */
    function createNewPokemon(string memory _name, address _to, string memory _img) public {
        require(msg.sender == gameOwner, "Only the game owner can create new Pokemons");
        require(_to != address(0), "Cannot mint to the zero address");

        uint256 id = pokemons.length;
        pokemons.push(Pokemon(_name, 1, _img));
        _safeMint(_to, id);
    }
}
