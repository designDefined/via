import { Div, H1, H3, H4, H5, Li, Main, Section, Strong, Ul } from "@fluid/core";

export default function Home() {
  return (
    <Main
      fluid={{
        align: ["stretch", "auto", "100vw"],
        justify: ["start", "auto", "100vh"],
        spacing: ["40px 80px"],
        overflow: ["hidden", "auto"],
      }}
    >
      <Section fluid={{ spacing: [0, 200] }}>
        <Div fluid={{ flex: [], flow: ["column", "nowrap", "end"] }}>
          <H1>
            <Strong>VIA:</Strong>
          </H1>
          <H1>나만의</H1>
          <H1 fluid={{ flow: ["row", "nowrap"] }}>
            <Strong>리액트 아키텍쳐</Strong>를
          </H1>
          <H1>찾아서</H1>
        </Div>
        <Div fluid={{ flow: ["row", "nowrap", "center", "space-between"] }}>
          <H3 fluid={{ flow: ["row", "nowrap"], spacing: [0, 12] }}>
            <Strong>박준영</Strong>
            DesignDefined
          </H3>
          <H5>FEConf 2024 Lightening Talk</H5>
        </Div>
      </Section>
      <Section fluid={{ flex: [0, 0, "200px"], flow: ["row", "wrap", "center", "center"], spacing: [120] }}>
        {/* <Img src="/via_logo.png" width={400} /> */}
      </Section>
      <Section fluid={{ spacing: [80, 64] }}>
        <H3 fluid={{}}>
          <Strong>목차</Strong>
        </H3>
        <H5>1. 리액트와의 권태기를 보내며</H5>
        <H5>2. 불만족의 여정</H5>
        <H5>3. 새로운 대안을 찾아서</H5>
        <H5>4. VIA 구축기</H5>
        <H5>5. 남은 이야기들</H5>
      </Section>
      <Section fluid={{ spacing: [80, 64] }}>
        <Title title="당신에게 아키텍쳐란" />
        <Div className="bordered" fluid={{ flow: ["row", "wrap", "center", "center"], spacing: ["120px 0", 40] }}>
          <H4>
            <Strong>MVC?</Strong>
          </H4>
          <H4>
            <Strong>MVVM?</Strong>
          </H4>
          <H4>
            <Strong>MVP?</Strong>
          </H4>
        </Div>
        <Ul>
          <Li>개발자라면 한 번쯤 관심을 가져보았을 만한 주제</Li>
          <Li>막상 실무에 도입하기는 어려운 기술 부채</Li>
          <Li>특히 프론트엔드에서는 계륵과 같다...?</Li>
        </Ul>
      </Section>
      <Section fluid={{ spacing: [80, 64] }}>
        <Title title="리액트, 너 변했다." />
      </Section>
      <Section fluid={{ spacing: [80, 64] }}>
        <Title title="리액트는 레고와 비슷하다!" />
      </Section>
      <Section fluid={{ spacing: [80, 64] }}>
        <Title title="너무나도 복잡한 상태 관리" />
      </Section>
    </Main>
  );
}

function Title({ title, subTitle }: { title: string; subTitle?: string }) {
  return (
    <H3 fluid={{ flow: ["row", "wrap"], spacing: ["0 0 24px 0"] }}>
      <Strong>{title}</Strong>
      {subTitle}
    </H3>
  );
}
