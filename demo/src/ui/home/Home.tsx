import { Div, H1, H2, H3, H4, H5, Img, Li, Main, Ol, P, Section, Span, Strong, Ul } from "@fluid/core";
import { externals } from "../../codeblock/externals";
import CodeBlock from "../../codeblock/CodeBlock";
import { others } from "../../codeblock/others";
import TodoApp from "../TodoApp/TodoApp";
import { Suspense } from "react";
import { viaExample } from "../../codeblock/via";
import TodoMessage from "../TodoMessage/TodoMessage";

export default function Home() {
  return (
    <Main
      fluid={{
        align: ["stretch", "auto", "100vw"],
        justify: ["start", "auto", "100vh"],
        spacing: ["40px 80px", 64],
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
            designDefined
          </H3>
          <H5>FEConf 2024 Lightning Talk</H5>
        </Div>
        <Div fluid={{ spacing: ["240px 0"] }}>
          <H3>viajs.vercel.app</H3>
        </Div>
      </Section>
      <Section fluid={{ flex: [0, 0, "200px"], flow: ["row", "wrap", "center", "center"], spacing: [120] }}></Section>
      <Section fluid={{ spacing: [80, 64] }}>
        <Title title="발표자" />
        <H4>박준영 DesignDefined</H4>
        <Ul>
          <Li>9개월차 프론트엔드 개발자</Li>
          <Li>
            <Strong>클래스데이</Strong>에서 학원 관리용 웹 애플리케이션을 만드는 중
          </Li>
          <Li>010-2787-4627 | designdefined.by@gmail.com</Li>

          <Div fluid={{ flow: ["row", "wrap", "center"], spacing: [20, 80] }}>
            <Img src="/classday_logo.png" width={128} />
            <Img src="/waffle.png" width={300} />
            <Div style={{ background: "#1c1c1c" }}>
              <Img src="/fe2024.png" width={200} />
            </Div>
          </Div>
        </Ul>
      </Section>
      <Section fluid={{ spacing: [80, 64] }}>
        <H3>
          <Strong>목차</Strong>
        </H3>
        <H5>1. 리액트와의 권태기를 보내며</H5>
        <H5>2. 불만족의 여정</H5>
        <H5>3. 새로운 대안을 찾아서</H5>
        <H5>4. VIA 구축기</H5>
        <H5>5. 남은 이야기들</H5>
      </Section>

      <Chapter title="리액트와의 권태기를 보내며" />
      <Section fluid={{ spacing: [80, 64] }}>
        <Title title="당신에게 아키텍쳐란" />
        <Div className="bordered" fluid={{ flow: ["row", "wrap", "center", "center"], spacing: ["120px 80px", 40] }}>
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
        <Title title="일이 손에 잡히지 않는 이유" />
        <Img src="/hard.jpg" width={640} />
      </Section>
      <Section fluid={{ spacing: [80, 64] }}>
        <Title title="리액트는 레고와 비슷하다!" />
        <Img src="/lego.png" width={640} />
        <Div fluid={{ spacing: [0, 24] }}>
          <H5 fluid={{ flow: ["row"] }}>
            <Strong>컴포넌트</Strong>를 자유롭게 분리, 결합하여 쉽고 빠른 작업이 가능
          </H5>
          <H5 fluid={{ flow: ["row"] }}>
            <Strong>실제 서비스</Strong>를 구축할 때에는…?
          </H5>
        </Div>
      </Section>
      <Section fluid={{ spacing: [80, 64] }}>
        <Title title="너무나도 복잡한 상태 관리" />
        <P>
          특히 까다로운 부분은 상태 관리. <br />
          서비스의 규모가 크고 복잡해질수록 상태의 확장이나 유지보수가 어려워진다.
        </P>
        <CodeBlock code={others.stateManage} />
        <P>
          특히 까다로운 부분은 상태 관리. <br />
          서비스의 규모가 크고 복잡해질수록 상태의 확장이나 유지보수가 어려워진다.
        </P>
        <Div className="bordered" fluid={{ flow: ["row", "wrap", "center", "center"], spacing: ["120px 80px", 40] }}>
          <H4>Props Drilling</H4>
        </Div>
      </Section>

      <Chapter title="불만족의 여정" />
      <Section fluid={{ spacing: [80, 64] }}>
        <Title title="Redux" subTitle=": 상태 관리의 근본" />
        <CodeBlock code={externals.reduxExample} />
        <P>
          Redux는 가장 많이 사용되는 라이브러리로
          <br />
          리액트의 단방향성을 유지하면서도 Props Drilling 문제를 해결하기 위해 고안되었다.
        </P>
        <Div className="bordered" fluid={{ spacing: ["40px 80px"] }}>
          <Ul className="pros">
            <Li>넓은 생태계와 호환성</Li>
            <Li>전역 상태를 선언적이고 효율적으로 관리할 수 있다</Li>
          </Ul>
          <Ul className="cons">
            <Li>보일러플레이트 코드가 많다</Li>
            <Li>서비스가 확장될 때마다 많은 고민이 필요하고, 기존의 상태와 통합하기가 어렵다</Li>
          </Ul>
        </Div>
      </Section>
      <Section fluid={{ spacing: [80, 64] }}>
        <Title title="Recoil & Jotai" subTitle=": 너무 복잡한 건 싫어" />
        <CodeBlock code={externals.jotaiExample} />
        <P>
          Recoil과 Jotai는 Atomic State Management Library로
          <br />
          빠르고 간편한 전역 상태 관리를 지원한다
        </P>
        <Div className="bordered" fluid={{ spacing: ["40px 80px"] }}>
          <Ul className="pros">
            <Li>훨씬 짧고 간단한 API </Li>
            <Li>컴포넌트 내/외부에서 자유롭게 접근 가능</Li>
            <Li>훨씬 짧고 간단한 API useState처럼 직관적인 상태 변경</Li>
          </Ul>
          <Ul className="cons">
            <Li>너무 자유롭기 때문에 별도의 관리 방법이 필요</Li>
            <Li>상태가 복잡해질수록 떨어지는 가독성</Li>
          </Ul>
        </Div>
      </Section>
      <Section fluid={{ spacing: [80, 64] }}>
        <Title title="Redux Toolkit & Zustand" />
        <CodeBlock code={externals.zustandExample} />
        <P>Zustand는 보다 적은 코드로 Redux의 사용성을 개선하고 유연함을 더했다</P>
        <Div className="bordered" fluid={{ spacing: ["40px 80px"] }}>
          <Ul className="pros">
            <Li>빠르게 상태를 추가해야할 때 생산성 향상</Li>
          </Ul>
          <Ul className="cons">
            <Li>그러나 Redux의 구조는 정말 많은 것을 제한하는가?</Li>
          </Ul>
        </Div>
      </Section>
      <Section fluid={{ spacing: [80, 64] }}>
        <Title title="React Query" subTitle=": Opinionated 라이브러리의 맛" />
        <CodeBlock code={externals.reactQueryExample} />
        <P>
          어차피 클라이언트의 상태는 서버에서 넘어온다는 점에서 출발한 React Query는
          <br />
          '겉으로 들어난' 전역 스토어 없이 상태를 관리한다
        </P>
        <Div className="bordered" fluid={{ spacing: ["40px 80px"] }}>
          <Ul className="pros">
            <Li>손 쉬운 비동기 데이터 처리</Li>
            <Li>Query와 Mutation으로 데이터 흐름을 분리하여 관리가 용이</Li>
            <Li>cache invalidation으로 쉬운 상태 최신화</Li>
          </Ul>
          <Ul className="cons">
            <Li>상태가 내 것이 아니다… 서버 API에 대한 과한 의존성</Li>
            <Li>서버와 독립된(특히 유저가 관리하는) 상태를 관리하기가 까다로움</Li>
          </Ul>
        </Div>
      </Section>

      <Chapter title="새로운 대안을 찾아서" />
      <Section fluid={{ spacing: [80, 64] }}>
        <Title title="내가 바라는 아키텍쳐는..." />
        <Ol>
          <Li>
            리액트의 장점인 컴포넌트의 자유로운 분리와 결합이 가능 <br />
            {"->"} UI를 독립적으로 유지하고, 복잡한 UI에서도 가독성 유지
          </Li>
          <Li>
            상태를 관리하는 일관적인 방법을 제공 <br />
            {"->"} 서비스 확장 시 매 번 고민하지 않아도 코드 퀄리티 확보
          </Li>
          <Li>
            더도 말고 덜도 말고, 웹 프론트엔드에 필요한 API만 <br />
            {"->"} 대신 지원하는 기능에 대해서는 수정이 많이 필요하지 않게
          </Li>
          <Li>서버나 디자인 작업에 대한 의존성을 최소화하면 좋겠다...</Li>
        </Ol>
      </Section>
      <Section fluid={{ spacing: [80, 64] }}>
        <Title title="MVI와의 만남" />
        <Img src="/mvi.png" width={640} />
        <P>
          UI의 상태를 View (서버에서 불러와 사용자에게 보여주는 부분)과 Intent (사용자의 조작이 서버에 전달되는
          부분)으로 구분.
          <br />
          상태의 흐름을 단방향으로 관리한다
        </P>
        <H3>더 간단할 수는 없을까?</H3>
        <P>
          웹 프론트엔드는 비즈니스 로직의 처리를 백엔드에 완전히 맡긴 특이한 형태
          <br />
          단순한 타입 명시 이상의 Model이 필요한가?
        </P>
      </Section>
      <Section fluid={{ spacing: [80, 64], align: ["center"] }}>
        <Img src="/via_logo.png" width={600} />
        <H2>
          <a href="https://github.com/designDefined/via" target="_blank">
            VIA
          </a>
        </H2>
        <H4>View - Intent - Architecture for ReactJS</H4>
      </Section>

      <Chapter title="VIA 구축기" />
      <Section fluid={{ spacing: [80, 64] }}>
        <Div fluid={{ align: ["center"] }}>
          <P>
            <i>Thanks to Zustand, Jotai, React-Query</i>
          </P>
        </Div>
        <Section fluid={{ spacing: [0, 20] }}>
          <Title title="구상하기" />
          <Ul>
            <Li>
              컴포넌트 바깥에 View와 Intent를 선언 (like Atom of recoil & jotai) <br />
              의존성을 주입받는 함수 형태로 존재
            </Li>
            <Li>
              전역 상태관리 스토어가 존재하지만, 컴포넌트 내부에서 useView, useIntent와 같은 hook을 사용해야만 상태에
              접근할 수 있음(like react-query)
            </Li>
            <Li>View는 캐시 데이터가 오래되거나, Intent의 결과로만 업데이트되어 데이터의 단방향성 유지</Li>
          </Ul>
        </Section>
        <Section fluid={{ spacing: [0, 20] }}>
          <Title title="View" />
          <CodeBlock code={viaExample.view1} />
          <CodeBlock code={viaExample.view2} />
        </Section>
        <Section fluid={{ spacing: [0, 20] }}>
          <Title title="useView" />
          <CodeBlock code={viaExample.useView} />
        </Section>
        <Section fluid={{ spacing: [0, 20] }}>
          <Title title="Intent" />
          <CodeBlock code={viaExample.intent} />
        </Section>
        <Section fluid={{ spacing: [0, 20] }}>
          <Title title="useIntent" />
          <CodeBlock code={viaExample.useIntent} />
          <CodeBlock code={viaExample.useIntentSubmit} />
        </Section>
        <Section fluid={{ spacing: [0, 20] }}>
          <Title title="Input" />
          <CodeBlock code={viaExample.parser} />
        </Section>
        <Suspense>
          <Div fluid={{ spacing: [20, 0] }}>
            <TodoMessage />
            <TodoApp />
          </Div>
        </Suspense>
        <Section fluid={{ spacing: [0, 20] }}>
          <Title title="Input" />
          <CodeBlock code={viaExample.todoApp} />
        </Section>
      </Section>

      <Chapter title="남은 이야기들" />
      <Section fluid={{ spacing: [80, 64], align: ["center"] }}>
        <H4>
          <Strong>DIY 아키텍쳐의 효능?</Strong>
        </H4>
        <Ul>
          <Li>적은 코드와 높아진 생산성</Li>
          <Li>상태관리 라이브러리 개발자들의 고충에 대한 이해</Li>
          <Li>즐거워진 밤샘</Li>
          <Li>
            <Strong>업무 시간의 재구조화</Strong>
          </Li>
        </Ul>
      </Section>
      <Section fluid={{ spacing: [80, 64], align: ["center"] }}>
        <H4>
          <Strong>더 개발할 것?</Strong>
        </H4>
        <Img src="/rxjs.png" />
        <CodeBlock code={others.complicated} />
      </Section>
      <Section fluid={{ spacing: [80, 64], align: ["center"] }}>
        <H4>
          <Strong>꼭 하고싶은 말</Strong>
        </H4>
        <Img src="/redux.png" width={800} />
      </Section>
    </Main>
  );
}

function Title({ title, subTitle }: { title: string; subTitle?: string }) {
  return (
    <H3 fluid={{ flow: ["row", "wrap"], spacing: ["0 0 24px 0"] }}>
      <Strong>{title}</Strong>
      <Span>{subTitle}</Span>
    </H3>
  );
}

function Chapter({ title }: { title: string }) {
  return (
    <Div fluid={{ flow: ["column", "wrap", "center", "center"], spacing: ["160px 0"] }}>
      <H2>{title}</H2>
    </Div>
  );
}
