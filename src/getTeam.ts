import * as api from './api';

async function main() {
    const teamId = process.argv[2];
    if (!teamId) {
        console.error('Please provide a team ID as a command-line argument.');
        process.exit(0);
    }
    try {
        const team = await api.getTeamDetails(teamId);
        const roster = team.members
            .map((member) => {
                return `'${member.user_id}', // "${member.nickname}"`;
            })
            .join('\n');
        console.log(roster);
    } catch {
        console.error('Failed to fetch team details. Please check the team ID and your API key.');
    }
}

main();
