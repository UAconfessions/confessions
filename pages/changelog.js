import Head from "../components/head/head";
import Article from '../components/article/Article';
import {dateStringToReadable} from "../utils/dateHelper";
import fs from 'fs';
import { join } from 'path';


export async function getStaticProps() {
	const rootDirectory = process.cwd();
	const fullPath = join(rootDirectory, 'CHANGELOG.md');
	const fileContents = fs.readFileSync(fullPath, 'utf8');
	const [, ...changelogRaw] = fileContents.split('\n## ');
	const changelog = Object.fromEntries(changelogRaw.map(versionRaw => {
		const [date, ...sectionsRaw] = versionRaw.split('\n### ');
		const sections = Object.fromEntries(sectionsRaw.map(sectionRaw => {
			const [name, ...changes] = sectionRaw.replace(/\n - /g, '\n- ').split('\n- ');
			return [name, changes];
		}))
		return [date, sections];
	}));

	return { props: { changelog } };
}

const Changelog = (props) => {
	return (
		<>
			<Head title={'Changelog'} />
			<section>
				<h1>The changes we've made.</h1>
				{Object.entries(props.changelog).map(([ date, sections ]) => (
					<Article
						key={date}
						header={
							<span>{dateStringToReadable(date)}</span>
						}
					>
						{Object.entries(sections).map(([section, list]) => (
							list?.length > 0 && (
								<section key={section}>
									<h2>{section}</h2>
									<ul>
										{list.map( (item, index) => <li key={index}>{item}</li>)}
									</ul>
								</section>
							)
						))}
					</Article>
				))}

			</section>
		</>
	)
}

export default Changelog
