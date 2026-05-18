const Employee = require('../models/Employee');

const getRecommendation = async (req, res) => {
  try {
    const { employeeId, allEmployees } = req.body;
    let employeeData;

    if (allEmployees) {
      employeeData = await Employee.find().sort({ performanceScore: -1 });
    } else if (employeeId) {
      employeeData = await Employee.findById(employeeId);
      if (!employeeData) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }
    } else {
      return res.status(400).json({ success: false, message: 'Provide employeeId or set allEmployees: true' });
    }

    const prompt = allEmployees
      ? `You are an expert HR AI analyst. Analyze these employees and provide:
1. Overall ranking from best to worst performer
2. Top 3 promotion candidates with reasons
3. Employees who need training with specific skill recommendations
4. Team performance summary

Employee Data:
${JSON.stringify(employeeData, null, 2)}

Provide structured, actionable recommendations.`
      : `You are an expert HR AI analyst. Analyze this employee and provide:
1. Promotion recommendation (Yes/No with reasoning)
2. Performance assessment
3. Top 3 training recommendations
4. Career growth suggestions
5. Feedback message

Employee Data:
${JSON.stringify(employeeData, null, 2)}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Employee AI Analytics',
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
      }),
    });

    const aiData = await response.json();

    if (!aiData.choices || !aiData.choices[0]) {
      return res.status(500).json({ success: false, message: 'AI service unavailable. Check your API key.' });
    }

    return res.status(200).json({
      success: true,
      employee: allEmployees ? null : employeeData,
      recommendation: aiData.choices[0].message.content,
      model: aiData.model,
    });
  } catch (error) {
    console.error('AI error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getRecommendation };