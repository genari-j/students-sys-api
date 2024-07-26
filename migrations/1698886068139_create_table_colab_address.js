module.exports = {
  up: `
    CREATE TABLE IF NOT EXISTS colab_address (
      \`id\` int(11) NOT NULL AUTO_INCREMENT,
      \`street\` varchar(255) NOT NULL,
      \`number\` varchar(255) NOT NULL,
      \`neighborhood\` varchar(255) NOT NULL,
      \`complement\` varchar(255) NULL DEFAULT NULL,
      \`city\` varchar(255) NOT NULL,
      \`state\` varchar(255) NOT NULL,
      \`cep\` varchar(255) NOT NULL,
      \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
      \`deletedAt\` timestamp NULL DEFAULT NULL,
      PRIMARY KEY (\`id\`)
    )
  `,
  down: 'DROP TABLE IF EXISTS colab_address'
}