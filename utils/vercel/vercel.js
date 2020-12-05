export const rebuildProject = async () => {
	await fetch('https://api.vercel.com/v1/integrations/deploy/' + process.env.VERCEL_DEPLOY_HOOK, {method: 'POST'});
}
