import { Prisma, PrismaClient, Sex } from '@prisma/client';

type PersonCreateInput = Omit<Prisma.PersonUncheckedCreateInput, 'treeId'>;

const users: Prisma.UserCreateInput[] = [
  {
    email: 'test@gmail.com',
    firstName: 'user 1',
    lastName: 'fallback',
    password: '$2b$10$E.RltWNqlJSytAdnfnVH7.UvSK2QhGvxL.Hno4CcdKijHyGGR3M7.',
    dateOfBirth: '2004-06-12T00:00:00.000Z',
    sex: Sex.MALE,
    trees: {
      create: [
        { name: 'tree 1' },
        { name: 'tree 2' },
        { name: 'tree 3' },
        { name: 'tree 4' },
        { name: 'tree 5' },
        { name: 'tree 6' },
        { name: 'tree 7' },
        { name: 'tree 8' },
        { name: 'tree 9' },
        { name: 'tree 10' },
      ],
    },
  },
  {
    email: 'test2@gmail.com',
    firstName: 'user 2',
    lastName: 'fallback',
    password: '$2b$10$eJPZT2a5OiZ0xw2CGHfGvu4zB25uPeaShCCeN4MjnwPGjp5bBw7xi',
    dateOfBirth: '2004-06-12T00:00:00.000Z',
    sex: Sex.MALE,
  },
  {
    email: 'test3@gmail.com',
    firstName: 'user 3',
    lastName: 'fallback',
    password: '$2b$10$LJEcHx.bt5eG.6xnBaETcuhqlHOh.7Vwk9duU/rhqtFZ2hcM8ST96',
    dateOfBirth: '2004-06-12T00:00:00.000Z',
    sex: Sex.FEMALE,
  },
  {
    email: 'test4@gmail.com',
    firstName: 'user 4',
    lastName: 'fallback',
    password: '$2b$10$LJEcHx.bt5eG.6xnBaETcuhqlHOh.7Vwk9duU/rhqtFZ2hcM8ST96',
    dateOfBirth: '2004-06-12T00:00:00.000Z',
    sex: Sex.FEMALE,
  },
];

const prisma = new PrismaClient();

const main = async () => {
  for (const user of users) {
    const { trees, sex, dateOfBirth, firstName, lastName } =
      await prisma.user.create({ data: user, include: { trees: true } });

    const person: PersonCreateInput = { firstName, lastName, dateOfBirth, sex };

    for (const tree of trees) {
      await prisma.person.create({
        data: { ...person, treeId: tree.id, userId: tree.ownerId },
      });
    }
  }
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
