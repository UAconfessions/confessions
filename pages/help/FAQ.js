import Head from "../../components/head/head";
import Article from '../../components/article/Article';
import fs from 'fs';
import { join } from 'path';


export async function getStaticProps() {
	const rootDirectory = process.cwd();
	const fullPath = join(rootDirectory, 'FAQ.md');
	const fileContents = fs.readFileSync(fullPath, 'utf8');
	const [, ...faqRaw] = fileContents.split('\n## ');
	const sections = Object.fromEntries(faqRaw.map(sectionRaw => {
		const [sectionName, ...questionsRaw] = sectionRaw.split('\n### ');
		const questions = questionsRaw.map(questionRaw => {
			const [question, ...answerLines] = questionRaw.split('\n');
			return { question, answer: answerLines.join('\n')};
		});
		return [sectionName, questions];
	}));

	return { props: { sections } };
}

const FAQ = (props) => {
	return (
		<>
			<Head title={'Frequently Asked Questions'} />
			<section>
				{Object.entries(props.sections).map(([ name, questions ]) => (
					<section key={name}>
						<h1>{name}</h1>
						{questions?.map(({ question, answer }, index) => (
							<Article
								key={index}
								header={
									<h2>{question}</h2>
								}
							>
								{answer}
							</Article>
						))}

					</section>
				))}

			</section>
		</>
	)
}

export default FAQ
