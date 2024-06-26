import { faker } from '@faker-js/faker'
import { type PrismaClient } from '@prisma/client'
import { UniqueEnforcer } from 'enforce-unique'
import bcrypt from 'bcryptjs'

const uniqueUsernameEnforcer = new UniqueEnforcer()

export function createPassword(password: string = faker.internet.password()) {
	return {
		hash: bcrypt.hashSync(password, 10),
	}
}

export function createUser() {
	const firstName = faker.person.firstName()
	const lastName = faker.person.lastName()
	const username = uniqueUsernameEnforcer
		.enforce(() => {
			return (
				faker.string.alphanumeric({ length: 2 }) +
				'_' +
				faker.internet.userName({
					firstName: firstName.toLowerCase(),
					lastName: lastName.toLowerCase(),
				})
			)
		})
		.slice(0, 20)
		.toLowerCase()
		.replace(/[^a-z0-9_]/g, '_')

	return {
		username,
		name: `${firstName} ${lastName}`,
		email: `${username}@example.com`,
	}
}

// TODO: Create password util

// TODO: getNoteImages util

// TODO: getUserImages util

// TODO: img util

export async function cleanupDb(prisma: PrismaClient) {
	const tables = await prisma.$queryRaw<
		{ name: string }[]
	>`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_migrations'`

	await prisma.$transaction([
		prisma.$executeRawUnsafe(`PRAGMA foreign_keys = OFF`),
		...tables.map(({ name }) =>
			prisma.$executeRawUnsafe(`DELETE from "${name}"`),
		),
		prisma.$executeRawUnsafe(`PRAGMA foreign_keys = ON`),
	])
}
