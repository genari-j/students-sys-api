module.exports = {
  up: `
    CREATE TABLE IF NOT EXISTS rel_colab_address (
      \`id\` int(11) NOT NULL AUTO_INCREMENT,
      \`colabId\` int(11) NOT NULL,
      \`colabAddressId\` int(11) NOT NULL,
      \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
      \`deletedAt\` timestamp NULL DEFAULT NULL,
      PRIMARY KEY (\`id\`),
      CONSTRAINT rel_colab_address_fk_1 FOREIGN KEY (\`colabId\`) REFERENCES colaborators(\`id\`),
      CONSTRAINT rel_colab_address_fk_2 FOREIGN KEY (\`colabAddressId\`) REFERENCES colab_address(\`id\`)
    )
  `,
  down: 'DROP TABLE IF EXISTS rel_colab_address'
}