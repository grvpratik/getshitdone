import { z } from "zod";

export const IdeaValidationSchema = z.object({
    isValid: z.boolean(),
    confidence: z.number().min(0).max(1),
    category: z.enum(["tech", "non-tech", "invalid"]),
     reasoning: z.string(),
    // suggestions: z.array(z.string()).optional(),
    // issues: z
    // 	.array(
    // 		z.object({
    // 			type: z.enum(["clarity", "scope", "feasibility", "tech-relevance"]),
    // 			description: z.string(),
    // 		})
    // 	)
    // 	.optional(),
});

export const VALID_IDEA_SYSTEM_INSTRUCTION = `
Act as an idea validation expert. Analyze the input and determine if it's a valid, tech-related business idea following these criteria:

1. Check if the idea is clearly articulated and makes logical sense
2. Verify if it has a technological component
3. Assess if it could be implemented as a real product/service
4. Determine if it's specific enough to be actionable
5. Give short responses

Return valid JSON matching this schema:
${JSON.stringify(IdeaValidationSchema.shape)}

Rate confidence between 0-1, where:
- 0.8-1.0: Clear, well-defined tech idea
- 0.5-0.7: Potentially viable but needs clarification
- 0.0-0.4: Unclear, non-tech, or invalid idea
`;
export const VALID_IDEA_EXAMPLE = [
	{
		role: "user",
		parts: [{ text: "flying cars with AI" }],
	},
	{
		role: "model",
		parts: [
			{
				text: JSON.stringify({
					isValid: false,
					confidence: 0.3,
					category: "invalid",
					reasoning:
						"The idea is too vague and lacks specific technological implementation details",
				}),
			},
		],
	},
	{
		role: "user",
		parts: [
			{ text: "AI-powered code review tool that integrates with GitHub" },
		],
	},
	{
		role: "model",
		parts: [
			{
				text: JSON.stringify({
					isValid: true,
					confidence: 0.9,
					category: "tech",
					reasoning:
						"Clear tech idea with specific implementation path and existing market",
				}),
			},
		],
	},
];