import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-module/prisma-service';
import { AuthService } from '../../modules/auth-module/services/auth-service';

@Injectable()
export class SeederService {
  constructor(private prismaService: PrismaService) {}

  async seed(): Promise<void> {
    await this.prismaService.$transaction(async () => {
      const organization = await this.prismaService.organizations.create({
        data: {
          name: 'Uex tecnologia',
          color: '#2ec7d6',
        },
      });
      await this.prismaService.store.create({
        data: {
          name: 'Uex store',
          organizationId: organization.id,
        },
      });
      await this.prismaService.products.createMany({ data: productsList });
      await this.prismaService.users.createMany({ data: users });
      await this.prismaService.users.create({
        data: {
          userName: 'teste',
          email: 'admin@uex.io',
          coins: 100,
          gas: 100,
          password: await AuthService.generateEncryptedPassword('admin'),
          organizationId: organization.id,
          isAdmin: true,
        },
      });
      await this.prismaService.exchanges.createMany({
        data: exchanges,
      });
      const response = await this.prismaService.exchanges.findMany();
      const history = response.map((e) => {
        return {
          organizationId: 1,
          exchangeId: e.id,
        };
      });
      await this.prismaService.history.createMany({ data: history });
    });
  }
}

const productsList = [
  {
    name: 'Dia de folga',
    storeId: 1,
    description:
      'Um dia livre para descansar, cuidar da saúde mental ou passar mais tempo com a família. Ideal para recarregar as energias e voltar ao trabalho mais motivado.',
    value: 1000,
    picture:
      'https://static.vecteezy.com/ti/vetor-gratis/p1/7790618-jovem-feliz-caucasiano-homem-branco-relaxando-na-praia-em-uma-rede-debaixo-das-palmeiras-homem-hipster-deitado-na-rede-na-praia-tropical-vetor.jpg',
  },
  {
    name: 'Mensalidade de academia',
    storeId: 1,
    description:
      'Investimento direto na sua saúde e qualidade de vida. A prática de exercícios físicos reduz o estresse, melhora a disposição e fortalece o corpo.',
    value: 100,
    picture:
      'https://invexo.com.br/blog/wp-content/uploads/2022/12/smartfit-academias-na-barra-da-tijuca-rio-de-janeiro-1024x576.jpg.webp',
  },
  {
    name: 'Mentoria',
    storeId: 1,
    description:
      'Acompanhamento de um mentor experiente para acelerar seu crescimento profissional, desenvolver novas habilidades e ampliar sua visão de carreira.',
    value: 30,
    picture:
      'https://faculdadephorte.edu.br/wp-content/uploads/2021/07/lider-de-sucesso.jpg',
  },
  {
    name: 'Participação em evento',
    storeId: 1,
    description:
      'Oportunidade de networking e aprendizado em eventos relevantes da área. Uma forma de adquirir novos conhecimentos e se manter atualizado no mercado.',
    value: 50,
    picture:
      'https://cdn.prod.website-files.com/636d4036709c50b9ac704e98/65b157c74e6fb6c92b778c37_eventos-inovacao-tecnologia_2024_numerik.jpg',
  },
  {
    name: 'Coca-cola',
    storeId: 1,
    description:
      'Um momento de prazer e refrescância no dia a dia. A bebida clássica que pode tornar sua pausa mais agradável e revigorante.',
    value: 10,
    picture:
      'https://coca-colafemsa.com/assets/img/home/slide/kof-home-banner-principal-coca-cola-1-.png',
  },
  {
    name: 'Heineken',
    storeId: 1,
    description:
      'Uma cerveja premium para celebrar conquistas e momentos especiais. Traz descontração e equilíbrio entre vida pessoal e profissional.',
    value: 10,
    picture:
      'https://www.seudinheiro.com/uploads/2020/02/garrafas-heineken-1920x1080-715x402.jpg',
  },
  {
    name: 'Moletom nerd',
    storeId: 1,
    description:
      'Conforto e estilo em uma peça pensada para quem valoriza tecnologia e cultura geek. Um produto que une praticidade e identidade.',
    value: 20,
    picture: '',
  },
];

const users = [
  {
    userName: 'elon mosca',
    email: 'elon.mosca@uex.io',
    picture:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/The_White_House_-_54409525537_%28cropped%29.jpg/250px-The_White_House_-_54409525537_%28cropped%29.jpg',
    organizationId: 1,
    password: '$2b$10$zGlgo09jmeuvPP7hpfVj5.nh1DI3TsSateAlXEArJHYFIC40m49G2',
  },
  {
    userName: 'bill geleia',
    email: 'bill.geleia@uex.io',
    picture:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Bill_Gates_at_the_European_Commission_-_2025_-_P067383-987995_%28cropped%29.jpg/250px-Bill_Gates_at_the_European_Commission_-_2025_-_P067383-987995_%28cropped%29.jpg',
    organizationId: 1,
    password: '$2b$10$zGlgo09jmeuvPP7hpfVj5.nh1DI3TsSateAlXEArJHYFIC40m49G2',
  },
  {
    userName: 'stephen hawking',
    email: 'stephen.hawking@uex.io',
    picture:
      'https://upload.wikimedia.org/wikipedia/commons/e/eb/Stephen_Hawking.StarChild.jpg',
    organizationId: 1,
    password: '$2b$10$zGlgo09jmeuvPP7hpfVj5.nh1DI3TsSateAlXEArJHYFIC40m49G2',
  },
  {
    userName: 'Emineco',
    email: 'emineco@uex.io',
    picture:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Eminem_2021_Color_Corrected.jpg/250px-Eminem_2021_Color_Corrected.jpg',
    organizationId: 1,
    password: '$2b$10$zGlgo09jmeuvPP7hpfVj5.nh1DI3TsSateAlXEArJHYFIC40m49G2',
  },
  {
    userName: 'Donald trompetista',
    email: 'donald.trompetista@uex.io',
    picture:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Official_Presidential_Portrait_of_President_Donald_J._Trump_%282025%29.jpg/330px-Official_Presidential_Portrait_of_President_Donald_J._Trump_%282025%29.jpg',
    organizationId: 1,
    password: '$2b$10$zGlgo09jmeuvPP7hpfVj5.nh1DI3TsSateAlXEArJHYFIC40m49G2',
  },
];

const exchanges = [
  {
    userId: 1,
    employeeId: 2,
    value: 10,
    message: 'Valeu tamo junto!!',
  },
  {
    userId: 2,
    employeeId: 3,
    value: 10,
    message: 'Valeu tamo junto!!',
  },
  {
    userId: 3,
    employeeId: 4,
    value: 10,
    message: 'Valeu tamo junto!!',
  },
  {
    userId: 4,
    employeeId: 5,
    value: 10,
    message: 'Valeu tamo junto!!',
  },
  {
    userId: 5,
    employeeId: 4,
    value: 10,
    message: 'Valeu tamo junto!!',
  },
  {
    userId: 4,
    employeeId: 3,
    value: 10,
    message: 'Valeu tamo junto!!',
  },
  {
    userId: 3,
    employeeId: 2,
    value: 10,
    message: 'Valeu tamo junto!!',
  },
  {
    userId: 2,
    employeeId: 1,
    value: 10,
    message: 'Valeu tamo junto!!',
  },
];
