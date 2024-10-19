import { Prisma, PrismaClient, Sex } from '@prisma/client';
import { randomUUID } from 'crypto';

const users: Prisma.UserCreateInput[] = [
  {
    id: randomUUID(),
    email: 'test@gmail.com',
    firstName: 'user 1',
    lastName: 'fallback',
    password: '$2b$10$E.RltWNqlJSytAdnfnVH7.UvSK2QhGvxL.Hno4CcdKijHyGGR3M7.',
    dateOfBirth: '2004-06-12T00:00:00.000Z',
    sex: Sex.MALE,
  },
  {
    id: randomUUID(),
    email: 'test2@gmail.com',
    firstName: 'user 2',
    lastName: 'fallback',
    password: '$2b$10$eJPZT2a5OiZ0xw2CGHfGvu4zB25uPeaShCCeN4MjnwPGjp5bBw7xi',
    dateOfBirth: '2004-06-12T00:00:00.000Z',
    sex: Sex.MALE,
  },
  {
    id: randomUUID(),
    email: 'test3@gmail.com',
    firstName: 'user 3',
    lastName: 'fallback',
    password: '$2b$10$LJEcHx.bt5eG.6xnBaETcuhqlHOh.7Vwk9duU/rhqtFZ2hcM8ST96',
    dateOfBirth: '2004-06-12T00:00:00.000Z',
    sex: Sex.FEMALE,
  },
  {
    id: randomUUID(),
    email: 'test4@gmail.com',
    firstName: 'user 4',
    lastName: 'fallback',
    password: '$2b$10$LJEcHx.bt5eG.6xnBaETcuhqlHOh.7Vwk9duU/rhqtFZ2hcM8ST96',
    dateOfBirth: '2004-06-12T00:00:00.000Z',
    sex: Sex.FEMALE,
  },
];

const referenceUserId = users[0].id;

const trees: Prisma.TreeUncheckedCreateInput[] = [
  { id: randomUUID(), name: 'tree 1', ownerId: referenceUserId },
  { id: randomUUID(), name: 'tree 2', ownerId: referenceUserId },
  { id: randomUUID(), name: 'tree 3', ownerId: referenceUserId },
  { id: randomUUID(), name: 'tree 4', ownerId: referenceUserId },
  { id: randomUUID(), name: 'tree 5', ownerId: referenceUserId },
  { id: randomUUID(), name: 'tree 6', ownerId: referenceUserId },
  { id: randomUUID(), name: 'tree 7', ownerId: referenceUserId },
  { id: randomUUID(), name: 'tree 8', ownerId: referenceUserId },
  { id: randomUUID(), name: 'tree 9', ownerId: referenceUserId },
  { id: randomUUID(), name: 'tree 10', ownerId: referenceUserId },
];

const referenceTreeId = trees[0].id;

const nodes: Prisma.NodeUncheckedCreateInput[] = [
  { id: randomUUID(), treeId: referenceTreeId, x: 0, y: 0 },
  { id: randomUUID(), treeId: referenceTreeId, x: 0, y: 0 },
  { id: randomUUID(), treeId: referenceTreeId, x: 0, y: 0 },
  { id: randomUUID(), treeId: referenceTreeId, x: 0, y: 0 },
  { id: randomUUID(), treeId: referenceTreeId, x: 0, y: 0 },
];

const people: Prisma.PersonUncheckedCreateInput[] = nodes.map(
  (node, index) => ({
    id: randomUUID(),
    nodeId: node.id,
    firstName: `Person ${index + 2} firstname`,
    lastName: `Person ${index + 2} lastname`,
    dateOfBirth: '2004-06-12T00:00:00.000Z',
    sex: Sex.MALE,
  }),
);

const prisma = new PrismaClient();

const main = async () => {
  await prisma.user.createMany({ data: users });
  await prisma.tree.createMany({ data: trees });
  await prisma.node.createMany({ data: nodes });
  await prisma.person.createMany({ data: people });
};

main()
  .then(async () => {
    await prisma.$connect();
  })
  .catch(async (err) => {
    console.log(err);
    await prisma.$disconnect();
    process.exit(1);
  });
