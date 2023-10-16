module.exports = {
  up: `
    CREATE TABLE IF NOT EXISTS colab_departments (
      \`id\` int(11) NOT NULL AUTO_INCREMENT,
      \`name\` varchar(255) NOT NULL,
      \`active\` tinyint(1) NOT NULL DEFAULT '1',
      \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
      \`deletedAt\` timestamp NULL DEFAULT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY (\`name\`)
    )
  `,
  down: 'DROP TABLE IF EXISTS colab_departments'
}