import geminiPrompt from "../service/gemini-prompt_service.js";
import customEmbed from "../utils/custom-embed.js";

const mockGenerateContent=jest.fn()
jest.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockImplementation(() => ({
            generateContent: mockGenerateContent,
        })),
    })),
}));

describe('be fore input', () => {
    let mockcontent
    beforeEach(() => {
        mockGenerateContent.mockClear();
    });
    it('should be googd', async () => {
        const mockApiResponse = '{"skills":["Node.js","Python"],"experience_years":5}';
        mockGenerateContent.mockResolvedValue({
            response: { text: () => mockApiResponse },
        });
        const result = await customEmbed.extractdatafromcv_test('some cv text');
        console.log(result)
        expect(result).toEqual({ skills: ['Node.js', 'Python'], experience_years: 5 });
    });
    it('should extract CV data from a response wrapped in markdown', async () => {
        const mockApiResponse = '```json\n{"skills":["Node.js"],"experience_years":3}\n```';
        mockGenerateContent.mockResolvedValue({
            response: { text: () => mockApiResponse },
        });

        const result = await customEmbed.extractdatafromcv_test('some cv text');

        expect(result).toEqual({ skills: ['Node.js'], experience_years: 3 });
    });

    it('should throw an error if no JSON is found in the response', async () => {
        const mockApiResponse = 'Sorry, I cannot provide that information.';
        mockGenerateContent.mockResolvedValue({
            response: { text: () => mockApiResponse },
        });
        const result=await customEmbed.extractdatafromcv_test('some cv text');
        console.log(result)
        expect(result).rejects.toThrow("No valid JSON object found");
    });
});